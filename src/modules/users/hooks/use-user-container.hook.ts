import { useState, useEffect, useCallback, useRef } from "react";
import { userService } from "../service/user.service";
import { roleService } from "@/modules/roles/service/role.service";
import { employeeService } from "@/modules/employees/services/employee.service";
import { AppOperationError } from "@/globals/exceptions/api-error.handler";
import { User, UserStatus } from "../models/user.model";
import { Role } from "@/modules/roles/models/role.model";
import { Employee } from "@/modules/employees/models/employee.model";
import { PaginatedUsersResponseModel } from "../models/user-page.model";
import { PaginationMetaModel } from "@/globals/models/pagination.model";
import { toast } from "sonner";
import { UserStatus as FilterStatus } from "@/globals/components/UserStatusFilter";

export const useUserContainerHook = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMetaModel>({
    currentPage: 1,
    perPage: 5,
    total: 0,
    totalPages: 0,
    nextPage: null,
    previousPage: null,
  });  const [dataVersion, setDataVersion] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("active");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchParamsRef = useRef<{ page: number; search: string; status: FilterStatus } | null>(
    null
  );

  const pagesCache = useRef<
    Record<
      string,
      {
        data: User[];
        meta: PaginationMetaModel;
        timestamp: number;
      }
    >
  >({});

  const CACHE_VALIDITY_TIME = 5 * 60 * 1000;
  const fetchUsers = useCallback(
    async (page = currentPage, search = searchTerm, status = statusFilter, forceRefresh = false) => {
      const cacheKey = `${page}:${search}:${status}`;

      const cachedData = pagesCache.current[cacheKey];
      const now = Date.now();

      if (
        !forceRefresh &&
        cachedData &&
        now - cachedData.timestamp < CACHE_VALIDITY_TIME
      ) {
        setUsers(cachedData.data);
        setPaginationMeta(cachedData.meta);
        setIsLoading(false);
        return;
      }

      const fetchParams = { page, search, status };
      if (
        !forceRefresh &&
        lastFetchParamsRef.current &&
        lastFetchParamsRef.current.page === page &&
        lastFetchParamsRef.current.search === search &&
        lastFetchParamsRef.current.status === status
      ) {
        return;
      }

      lastFetchParamsRef.current = fetchParams;

      setIsLoading(true);
      setError(null);

      try {
        let response: PaginatedUsersResponseModel;
        // Determinar el valor de onlyActive según el filtro de estado
        let onlyActive: boolean | undefined;
        
        if (status === 'active') {
          onlyActive = true;
        } else if (status === 'inactive') {
          onlyActive = false;
        }
        // Si status es 'all', dejamos onlyActive como undefined

        if (search) {
          response = await userService.searchUsers(search, page);
        } else {
          response = await userService.getPaginatedUsers(page, 5, onlyActive);
        }

        if (response && response.data) {
          pagesCache.current[cacheKey] = {
            data: response.data,
            meta: response.meta,
            timestamp: now,
          };

          setUsers(response.data);

          if (response.meta) {
            setPaginationMeta(response.meta);
          }

          setDataVersion((prev) => prev + 1);
        } else {
          setUsers([]);
        }
      } catch (err) {
        let errorMessage = "Error al cargar los usuarios";

        if (err instanceof AppOperationError) {
          errorMessage = err.details || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, searchTerm, statusFilter, CACHE_VALIDITY_TIME]
  );

  const invalidateCache = useCallback(() => {
    pagesCache.current = {};
  }, []);

  const fetchRolesAndEmployees = useCallback(async () => {
    try {
      const [rolesData, employeesData] = await Promise.all([
        roleService.getAllRoles(),
        employeeService.getAllEmployees(),
      ]);

      setRoles(rolesData);
      setEmployees(employeesData);
    } catch (err) {
      let errorMessage = "Error al cargar los datos de referencia";

      if (err instanceof AppOperationError) {
        errorMessage = err.details || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, "");
    fetchRolesAndEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    const cacheKey = `${currentPage}:${searchTerm}:${statusFilter}`;
    const cachedData = pagesCache.current[cacheKey];
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_VALIDITY_TIME) {
      setUsers(cachedData.data);
      setPaginationMeta(cachedData.meta);
    }

    fetchTimeoutRef.current = setTimeout(() => {
      fetchUsers(currentPage, searchTerm, statusFilter);
    }, 300);

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [currentPage, searchTerm, statusFilter, fetchUsers, CACHE_VALIDITY_TIME]);

  const handleAddUser = useCallback(() => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEditUser = useCallback(
    (id?: number) => {
      if (id) {
        const user = users.find((user) => user.id === id);
        setSelectedUser(user);
        setIsModalOpen(true);
      }
    },
    [users]
  );

  const handleDeleteUser = useCallback(
    (id?: number) => {
      if (id) {
        const user = users.find((user) => user.id === id);
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
      }
    },
    [users]
  );
  const handleConfirmDelete = useCallback(async () => {
    if (userToDelete?.id) {
      setIsLoading(true);

      try {
        await userService.deleteUser(userToDelete.id);
        toast.success("Usuario eliminado", {
          description: "El usuario ha sido eliminado correctamente",
        });

        invalidateCache();

        if (users.length === 1 && currentPage > 1) {
          const previousPage = currentPage - 1;
          setCurrentPage(previousPage);
          fetchUsers(previousPage, searchTerm, statusFilter, true);
        } else {
          fetchUsers(currentPage, searchTerm, statusFilter, true);
        }
        setIsDeleteModalOpen(false);
      } catch (err) {
        let errorMessage = "Error al eliminar el usuario";

        if (err instanceof AppOperationError) {
          errorMessage = err.details || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [
    userToDelete,
    currentPage,
    searchTerm,
    statusFilter,
    fetchUsers,
    invalidateCache,
    users.length,
  ]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleteModalOpen(false);
    setUserToDelete(undefined);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  }, []);
  const handleSubmitUser = useCallback(
    async (data: User) => {
      setIsLoading(true);

      try {
        if (data.id) {
          await userService.updateUser(data.id, data);
          toast.success("Usuario actualizado", {
            description: "El usuario ha sido actualizado correctamente",
          });
          invalidateCache();
          fetchUsers(currentPage, searchTerm, statusFilter, true);
          setIsModalOpen(false);
          return true;
        } else {
          await userService.createUser(data);
          toast.success("Usuario creado", {
            description: "El usuario ha sido creado correctamente",
          });

          invalidateCache();

          if (users.length >= paginationMeta.perPage) {
            const newTotalItems = paginationMeta.total + 1;
            const newTotalPages = Math.ceil(
              newTotalItems / paginationMeta.perPage
            );

            if (newTotalPages > paginationMeta.totalPages) {
              setCurrentPage(newTotalPages);
              fetchUsers(newTotalPages, searchTerm, statusFilter, true);
            } else {
              fetchUsers(currentPage, searchTerm, statusFilter, true);
            }
          } else {
            fetchUsers(currentPage, searchTerm, statusFilter, true);
          }

          setIsModalOpen(false);
          return true;
        }
      } catch (err) {
        let errorMessage = "Error al guardar el usuario";

        if (err instanceof AppOperationError) {
          errorMessage = err.details || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
        setIsLoading(false);
        return false;
      }
    },
    [
      currentPage,
      searchTerm,
      statusFilter,
      fetchUsers,
      invalidateCache,
      users.length,
      paginationMeta,
    ]
  );
  const handleChangeUserStatus = useCallback(
    async (id: number, status: UserStatus) => {
      if (!id) return;

      setIsLoading(true);

      try {
        await userService.changeUserStatus(id, status);

        const statusText =
          status === UserStatus.ACTIVATE ? "activado" : "desactivado";

        toast.success(`Usuario ${statusText}`, {
          description: `El usuario ha sido ${statusText} correctamente`,
        });

        invalidateCache();
        fetchUsers(currentPage, searchTerm, statusFilter, true);
      } catch (err) {
        let errorMessage = "Error al cambiar el estado del usuario";

        if (err instanceof AppOperationError) {
          errorMessage = err.details || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, searchTerm, statusFilter, fetchUsers, invalidateCache]
  );

  const handleUpdatePassword = useCallback(
    async (id: number, oldPassword: string, newPassword: string) => {
      if (!id) return false;

      setIsLoading(true);

      try {
        const result = await userService.updatePassword(
          id,
          oldPassword,
          newPassword
        );
        toast.success("Contraseña actualizada", {
          description:
            result.message || "La contraseña ha sido actualizada correctamente",
        });
        return true;
      } catch (err) {
        let errorMessage = "Error al actualizar la contraseña";

        if (err instanceof AppOperationError) {
          errorMessage = err.details || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    // Si hay texto en la búsqueda, reiniciamos el filtro de estado a 'all'
    if (value) {
      setStatusFilter('all');
    }
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: FilterStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);
  const handlePageChange = useCallback(
    (page: number) => {
      const cacheKey = `${page}:${searchTerm}:${statusFilter}`;
      const cachedData = pagesCache.current[cacheKey];
      const now = Date.now();

      if (cachedData && now - cachedData.timestamp < CACHE_VALIDITY_TIME) {
        setUsers(cachedData.data);
        setPaginationMeta((prev) => ({
          ...prev,
          currentPage: page,
        }));
      }

      setCurrentPage(page);
    },
    [searchTerm, statusFilter, CACHE_VALIDITY_TIME]
  );  const handleDeleteMultipleUsers = useCallback(
    async (ids: number[]) => {
      if (ids.length === 0) return;

      setIsLoading(true);

      try {
        const result = await userService.deleteMultipleUsers(ids);
        toast.success("Usuarios eliminados", {
          description:
            result.message || "Los usuarios han sido eliminados correctamente",
        });

        invalidateCache();

        const allItemsDeleted = ids.length >= users.length;

        if (allItemsDeleted && currentPage > 1) {
          const previousPage = currentPage - 1;
          setCurrentPage(previousPage);
          fetchUsers(previousPage, searchTerm, statusFilter, true);
        } else {
          fetchUsers(currentPage, searchTerm, statusFilter, true);
        }

        setSelectedUserIds([]);
      } catch (err) {
        let errorMessage = "Error al eliminar los usuarios";

        if (err instanceof AppOperationError) {
          errorMessage = err.details || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        toast.error("Error", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, searchTerm, statusFilter, fetchUsers, invalidateCache, users.length]
  );

  const handleExportToExcel = useCallback(async (ids: number[]) => {
    if (ids.length === 0) return;

    setIsLoading(true);

    try {
      const excelBlob = await userService.exportUsersToExcel(ids);

      const url = window.URL.createObjectURL(excelBlob);
      const link = document.createElement("a");
      link.href = url;

      const date = new Date();
      const fileName = `usuarios_${date.getDate()}${
        date.getMonth() + 1
      }${date.getFullYear()}${date.getHours()}${date.getMinutes()}.xlsx`;

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Exportación completada", {
        description: "Los usuarios han sido exportados a Excel correctamente",
      });
    } catch (err) {
      let errorMessage = "Error al exportar los usuarios";

      if (err instanceof AppOperationError) {
        errorMessage = err.details || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectUsers = useCallback((ids: number[]) => {
    setSelectedUserIds(ids);
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, [dataVersion]);
  useEffect(() => {
    if (paginationMeta && paginationMeta.totalPages > 1) {
      const pagesToPreload: number[] = [];

      if (paginationMeta.nextPage) {
        pagesToPreload.push(paginationMeta.nextPage);
      }

      if (pagesToPreload.length > 0) {
        const preloadTimer = setTimeout(() => {
          pagesToPreload.forEach((page) => {
            const cacheKey = `${page}:${searchTerm}:${statusFilter}`;
            if (!pagesCache.current[cacheKey]) {
              (async () => {
                try {
                  let onlyActive: boolean | undefined;
                  
                  if (statusFilter === 'active') {
                    onlyActive = true;
                  } else if (statusFilter === 'inactive') {
                    onlyActive = false;
                  }
                  
                  if (searchTerm) {
                    const response = await userService.searchUsers(
                      searchTerm,
                      page
                    );
                    pagesCache.current[cacheKey] = {
                      data: response.data,
                      meta: response.meta,
                      timestamp: Date.now(),
                    };
                  } else {
                    const response = await userService.getPaginatedUsers(page, 5, onlyActive);
                    pagesCache.current[cacheKey] = {
                      data: response.data,
                      meta: response.meta,
                      timestamp: Date.now(),
                    };
                  }
                } catch (err) {
                  if (err instanceof AppOperationError) {
                    console.log(
                      `Error en precarga: ${err.details || err.message}`
                    );
                  } else {
                    console.log(`Error en precarga: `, err);
                  }
                }
              })();
            }
          });
        }, 1000);

        return () => clearTimeout(preloadTimer);
      }
    }
  }, [paginationMeta, searchTerm, statusFilter]);
  return {
    users,
    roles,
    employees,
    paginationMeta,
    dataVersion,
    currentPage,
    searchTerm,
    statusFilter,
    isModalOpen,
    selectedUser,
    isDeleteModalOpen,
    userToDelete,
    selectedUserIds,
    isLoading,
    error,
    handleAddUser,
    handleEditUser,
    handleDeleteUser,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseModal,
    handleSubmitUser,
    handleChangeUserStatus,
    handleUpdatePassword,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleDeleteMultipleUsers,
    handleExportToExcel,
    handleSelectUsers,
  };
};
