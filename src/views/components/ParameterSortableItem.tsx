import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Controller,
} from "react-hook-form";
import ParameterField from "@/views/components/ParameterField";
import { useLang } from "@/context/LangContext";
import { translations } from "@/utils/translations";

type ParameterSortableItemProps = {
    id: string;
    index: number;
    control: any;
    register: any;
    errors: any;
    remove: (index: number) => void;
    disabled?: boolean;
    enableDrag?: boolean;
};

export const ParameterSortableItem = ({ id, index, control, register, errors, remove, disabled, enableDrag }: ParameterSortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = enableDrag
            ? useSortable({ id })
            : {
                attributes: {},
                listeners: {},
                setNodeRef: () => { },
                transform: null,
                transition: undefined,
            };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const { selectedLang } = useLang();
    const t = translations[selectedLang];


    return (
        <div ref={setNodeRef} style={style} {...attributes} className="option-row">
            <Controller
                control={control}
                name={`options.${index}.option_text`}
                rules={{ required: true }}
                render={({ field }) => (
                    <ParameterField
                        {...field}
                        isShuffleIcon={true}
                        placeholder={t.text.enterOptionText}
                        className={errors.options?.[index]?.option_text ? "border-danger" : ""}
                        removeParameter={() => remove(index)}
                        dragHandleProps={listeners} // 👈 Pass drag handle here
                        disabled={disabled}
                    />
                )}
            />
            <div className="ratings">
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    placeholder="Rating.."
                    className={errors.options?.[index]?.self_rating ? "border-danger" : ""}
                    disabled={disabled}
                    {...register(`options.${index}.self_rating`, {
                        required: true,
                        valueAsNumber: true,
                    })}
                />
            </div>
        </div>
    );
};
