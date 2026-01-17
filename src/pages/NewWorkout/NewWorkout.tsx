import { Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, UseFormRegister } from "react-hook-form";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import workoutPlanService from "@/api/workout-plan";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/Switch";
import Chip from "@/components/ui/Chip";
import { NewWorkoutForm } from "./types";
import { TrainingCardCreate } from "@/components/TrainingCardCreate";
import { FormWithExercises } from "@/components/TrainingCardCreate/type";
import styles from "./NewWorkout.module.css";
import { useTranslate } from "@/hooks/useTranslate";
import { SectionWorkoutExercise } from "./fragments/SectionWorkoutExercise";

export default function NewWorkout() {
  const navigate = useNavigate();
  const { t } = useTranslate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<NewWorkoutForm>({
    defaultValues: {
      name: "",
      exercises: [
        {
          name: "",
          sets: 3,
          reps: 12,
          weight: 0,
          restTimeSeconds: 60,
        },
      ],
      isPublic: false,
      workoutType: "",
      muscleGroups: [],
      goals: [],
      trainingTime: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const onSubmit = async (data: NewWorkoutForm) => {
    try {
      await workoutPlanService.createPlan({
        name: data.name,
        isPublic: data.isPublic,
        exercises: data.exercises,
        muscleGroups: data.muscleGroups,
        goals: data.goals,
        trainingTime: parseInt(data.trainingTime),
        workoutType: data.workoutType,
      });
      toast({
        title: t('toast.success_title'),
        description: t('toast.success_description')
      });
      navigate("/workouts");
    } catch (err) {
      toast({
        title: t('toast.error_title'),
        description: t('toast.error_description'),
        variant: "destructive",
      })
      console.error("Erro ao criar ficha:", err);
    }
  };

  const workoutName = watch("name");
  const workoutType = watch("workoutType");
  const muscleGroups = watch("muscleGroups") || [];
  const goals = watch("goals") || [];
  const trainingTime = watch("trainingTime");

  const SPORT_LIST = ["Crossfit", "Musculação", "Natação", "Artes Marciais", "Calistenia"];
  const MUSCLE_GROUPS_LIST = ["Peito", "Costas", "Pernas (Posterior)", "Pernas (Quadriceps)", "Biceps", "Triceps", "Ombros", "Abdômen", "Glúteos"];
  const GOAL_LIST = ["Hipertrofia", "Emagrecimento", "Condicionamento físico", "Força", "Resistência", "Flexibilidade", "Reabilitação"];
  const TIME_LIST = ["30", "45", "60", "90"];

  const toggleMuscleGroup = (group: string) => {
    const current = muscleGroups;
    if (current.includes(group)) {
      setValue("muscleGroups", current.filter(g => g !== group));
    } else {
      setValue("muscleGroups", [...current, group]);
    }
  };

  const toggleGoal = (goal: string) => {
    const current = goals;
    if (current.includes(goal)) {
      setValue("goals", current.filter(g => g !== goal));
    } else {
      setValue("goals", [...current, goal]);
    }
  };

  return (
    <MobileLayout hideNav>
      <PageHeader
        title={t('new_workout.title')}
        showBack
        rightElement={
          <Button
            variant="gradient"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={!workoutName || isSubmitting}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSubmitting ? t('new_workout.saving') : t('new_workout.save')}
          </Button>
        }
      />

      <div className="px-4 py-6 space-y-6">
        <SectionWorkoutExercise
          label={t('new_workout.name_label')}
        >
          <Input
            placeholder={t('new_workout.name_placeholder')}
            className="h-12 bg-secondary border-0 rounded-xl"
            {...register("name", { required: true })}
          />
        </SectionWorkoutExercise>
        <SectionWorkoutExercise
          label={t('new_workout.goal_question')}
        >
          <ul className={styles.chipList}>
            {GOAL_LIST.map((goal) => (
              <Chip
                key={goal}
                label={goal}
                selected={goals.includes(goal)}
                onClick={() => toggleGoal(goal)}
              />
            ))}
          </ul>
        </SectionWorkoutExercise>
        <SectionWorkoutExercise
          label={t('new_workout.sport_type_question')}
        >
          <ul className={styles.chipList}>
            {
              SPORT_LIST.map((sport) => (
                <li key={sport}>
                  <Chip
                    label={sport}
                    selected={workoutType === sport}
                    onClick={() => setValue("workoutType", sport)}
                  />
                </li>
              ))
            }
          </ul>
          <button
            className={styles.addSportButton}
            onClick={() =>
              window.alert('Método em desenvolvimento')
            }
          >
            {t('new_workout.add_sport_button')}
          </button>
        </SectionWorkoutExercise>
        {workoutType === 'Musculação' && (
          <SectionWorkoutExercise
            label={t('new_workout.muscle_group_question')}
          >
            <ul className={styles.chipList}>
              {MUSCLE_GROUPS_LIST.map((group) => (
                <Chip
                  key={group}
                  label={group}
                  selected={muscleGroups.includes(group)}
                  onClick={() => toggleMuscleGroup(group)}
                />
              ))}
            </ul>
          </SectionWorkoutExercise>
        )}
        <SectionWorkoutExercise
          label={t('new_workout.time_available')}
        >
          <ul className={styles.chipList}>
            {TIME_LIST.map((time) => (
              <Chip
                key={time}
                label={`${time} min`}
                selected={trainingTime === time}
                onClick={() => setValue("trainingTime", time)}
              />
            ))}
          </ul>
        </SectionWorkoutExercise>

        <SectionWorkoutExercise
          label={t('new_workout.public_label')}
        >
          <p className="text-sm text-muted-foreground mb-3">
            {t('new_workout.public_description')}
          </p>

          <div className="flex items-center justify-between rounded-xl bg-secondary p-4 w-2/6">
            <span className="text-sm font-medium">
              {watch("isPublic") ? t('new_workout.yes') : t('new_workout.no')}
            </span>
            <Switch
              checked={watch("isPublic")}
              onChange={(value) =>
                setValue("isPublic", value)
              }
            />
          </div>
        </SectionWorkoutExercise>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              {t('new_workout.exercises_title')}
            </h3>
            <span className="text-sm text-muted-foreground">
              {fields.length === 1 ? t('new_workout.exercises_count', { count: fields.length }) : t('new_workout.exercises_count_plural', { count: fields.length })}
            </span>
          </div>

          <TrainingCardCreate
            fields={fields}
            register={register as unknown as UseFormRegister<FormWithExercises>}
            remove={remove}
          />
          <Button
            variant="outline"
            className="w-full mt-4 border-dashed"
            onClick={() =>
              append({
                name: "",
                sets: 3,
                reps: 12,
                weight: 0,
                restTimeSeconds: 60,
              })
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('new_workout.add_exercise_button')}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
