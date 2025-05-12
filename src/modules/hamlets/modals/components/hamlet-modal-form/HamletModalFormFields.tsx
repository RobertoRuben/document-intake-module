import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/modules/core/components/ui/form";
import { Input } from "@/modules/core/components/ui/input";
import { HamletFormValues } from "../../validators/hamlet.validator.schema";
import { DropdownSearchable } from "@/modules/core/components/ui/dropdown-searchable";
import { Home, MapPin } from "lucide-react";

interface HamletModalFormFieldsProps {
    form: UseFormReturn<HamletFormValues>;
    settlements: { id: number; name: string }[];
}

export const HamletFormFields: React.FC<HamletModalFormFieldsProps> = ({ 
    form, 
    settlements,
}) => {
    return (
        <div className="space-y-6">
            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <Home className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Información del Caserío</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Introduce los datos del caserío.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Nombre del Caserío</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ingrese el nombre del caserío"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="p-4 border rounded-lg shadow-sm bg-card">
                <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-medium">Ubicación</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                    Selecciona el centro poblado al que pertenece este caserío.
                </p>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="settlementId"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Asentamiento</FormLabel>
                                <FormControl>
                                    <DropdownSearchable
                                        data={settlements}
                                        textField="name"
                                        dataKey="id"
                                        placeholder="Seleccione un centro poblado"
                                        filter="contains"
                                        value={settlements.find(settlement => settlement.id === field.value)}
                                        onChange={(value) => field.onChange(value.id)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};