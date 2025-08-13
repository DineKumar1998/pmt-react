import React from 'react';
import { useForm, useFieldArray, Controller, type SubmitHandler } from 'react-hook-form';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import AddCircle from "@/views/components/icons/AddCircle";
import ParameterField from "@/views/components/ParameterField";
import { ParameterSortableItem } from "@/views/components/ParameterSortableItem";
import { translations } from "@/utils/translations";

// Define the shape of our form data
export type FormValues = {
  parameter: string;
  options: {
    id?: number;
    option_text: string;
    self_rating: number;
    display_order: number;
  }[];
};

// Define the props for our reusable form component
interface ParameterFormProps {
  onSubmit: SubmitHandler<FormValues>;
  initialValues?: Partial<FormValues>;
  isEditMode: boolean;
  disableParamEditing: boolean;
  language: "en" | "jp";
  actions: React.ReactNode; // Pass the action buttons as a prop
  isPrimary?:boolean
}

export const ParameterForm = ({
  onSubmit,
  initialValues,
  disableParamEditing,
  language,
  actions,
  isPrimary=false
}: ParameterFormProps) => {
  const t = translations[language];

  const {
    control,
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: initialValues || {
      parameter: "",
      options: [{ option_text: "", self_rating: 0, display_order: 1 }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "options",
  });
  
  // Reset form when initialValues change (e.g., navigating between params)
  React.useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);

      setTimeout(() => {
        const currentValues = getValues();
        const updatedOptions = currentValues.options.map((option, index) => ({
          ...option,
          display_order: index + 1,
        }));
        reset({ ...currentValues, options: updatedOptions });
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-container">
        <div className="mt-1">
          <p>{t.heading.parameter}</p>
          <Controller
            control={control}
            name="parameter"
            rules={{ required: true }}
            disabled={isPrimary}
            render={({ field }) => (
              <ParameterField
                {...field}
                placeholder={t.text.enterParameter}
                className={errors.parameter ? "border-danger" : ""}
                disabled={disableParamEditing || isPrimary}
                showDeleteIcon={false}
              />
            )}
          />
        </div>

        <div className="option-container">
          <div className="options">
            <div className="outer-label">
              <div className="options-label">
                <h4>{t.heading.options}</h4>
                {(!disableParamEditing && !isPrimary) && (
                  <span
                    className="add-option-button"
                    onClick={() =>
                      append({
                        option_text: "",
                        self_rating: 0,
                        display_order: fields.length + 1,
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <AddCircle />
                  </span>
                )}
              </div>
              <h4 className="rating-label">{t.heading.rating}</h4>
            </div>

          {
            !isPrimary ?  <DndContext   sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                {fields.map((option, index) => (
                  <ParameterSortableItem
                  isPrimary={isPrimary}
                    key={option.id}
                    id={option.id}
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    remove={remove}
                    disabled={disableParamEditing}
                    enableDrag={!disableParamEditing}
                  />
                ))}
              </SortableContext>
            </DndContext>  : <div>
              <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                {fields.map((option, index) => (
                  <ParameterSortableItem
                  isPrimary={isPrimary}
                    key={option.id}
                    id={option.id}
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    remove={remove}
                    disabled={disableParamEditing}
                    enableDrag={!disableParamEditing}
                  />
                ))}
              </SortableContext>
            </div>
          }  
          </div>
        </div>
      </div>
      {actions}
    </form>
  );
};
