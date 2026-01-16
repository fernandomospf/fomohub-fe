import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import workoutPlanService from "@/api/workout-plan";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/Switch";
import { useEffect } from "react";
import Chip from "@/components/ui/Chip";

interface ExerciseForm {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTimeSeconds: number;
}

interface NewWorkoutForm {
  name: string;
  isPublic: boolean;
  exercises: ExerciseForm[];
}

export default function NewWorkout() {
  const navigate = useNavigate();

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
        isPublic: false,
        exercises: data.exercises,
      });
      toast({
        title: "Ficha criada com sucesso!",
        description: "Sua nova ficha foi criada e estará disponível na lista de treinos."
      });
      navigate("/workouts");
    } catch (err) {
      toast({
        title: "Erro ao criar ficha",
        description: "Ocorreu um erro ao criar sua ficha. Por favor, tente novamente.",
        variant: "destructive",
      })
      console.error("Erro ao criar ficha:", err);
    }
  };

  const workoutName = watch("name");
  const SPORT_LIST = ["Crossfit", "Weightlifting", "Swimming", "Martial Arts", "Calisthenics"];

  return (
    <MobileLayout hideNav>
      <PageHeader
        title="Nova Ficha"
        showBack
        rightElement={
          <Button
            variant="gradient"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={!workoutName || isSubmitting}
          >
            <Save className="w-4 h-4 mr-1" />
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        }
      />

      <div className="px-4 py-6 space-y-6">
        {/* Nome do treino */}
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Nome do Treino
          </label>
          <Input
            placeholder="Ex: Treino A - Push"
            className="h-12 bg-secondary border-0 rounded-xl"
            {...register("name", { required: true })}
          />
        </div>
        <div>
          Qual seu objetivo?
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '8px'
          }}>
            <Chip
              label="Hipertrofia"
            />
            <Chip
              label="Emagrecimento"
            />
            <Chip
              label="Condicionamento físico"
            />
            <Chip
              label="Força"
            />
            <Chip
              label="Resistência"
            />
            <Chip
              label="Flexibilidade"
            />
            <Chip
              label="Reabilitação"
            />
          </ul>
        </div>
        <div>
          Quais grupos musculares você pretende focar?
          <ul style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '8px'
          }}>
            <Chip 
              label="Peito"
            />
            <Chip
              label="Costas"
            />
            <Chip
              label="Pernas (Posterior)"
            />
            <Chip
              label="Pernas (Quadriceps)"
            />
            <Chip
              label="Biceps"
            />
            <Chip
              label="Triceps"
            />
            <Chip
              label="Ombros"
            />
            <Chip
              label="Abdômen"
            />
            <Chip
              label="Glúteos"
            />
          </ul>
        </div>
        <div>
          Tempo disponível para treinar:

          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '8px'
            }}
          >
            <Chip 
              label="30 min"
            />
            <Chip
              label="45 min"
            />
            <Chip
              label="60 min"
            />
            <Chip
              label="90 min"
            />
            {/* <Input 
              placeholder="Digite o tempo em minutos..."
              style={{
                display: 'inline-block',
                width: '180px',
                marginLeft: '8px',
                padding: '4px 8px',
                borderRadius: '16px',
                backgroundColor: '#202126',
                color: '#fff9f9',
                border: 'none',
                outline: 'none',
              }}
              // {...register("time")}
            /> */}
          </ul>
        </div>
        {/* 
          Se o treino for de musculação, mostrar opções de tipos de grupo muscular
          Se for de corrida, mostrar opções de distância e terreno
          Se for de ciclismo, mostrar opções de distância e tipo de bicicleta
          Se for natação, mostrar opções de estilo e distância
          Se for treino funcional, mostrar opções de tipo de exercício e equipamento
          Se for artes marciais, mostrar opções de estilo e nível de habilidade
          Se for crossfit, mostrar opções de WOD e nível de habilidade
        */}
        <div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">
              Quer deixar pública sua ficha?
            </label>

            <p className="text-xs text-muted-foreground mb-3">
              Ao deixar sua ficha pública, outros usuários poderão visualizar e utilizar sua rotina de treino como referência.
            </p>

            <div className="flex items-center justify-between rounded-xl bg-secondary p-4 w-2/6">
              <span className="text-sm font-medium">
              {watch("isPublic") ? "Sim" : "Não"}
              </span>
              <Switch
              checked={watch("isPublic")}
              onChange={(value) =>
              setValue("isPublic", value)
              }
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mt-4">
                Qual tipo de exercicio você pretende criar?
              </p>
              <ul style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '8px'
              }}>
                {
                  SPORT_LIST.map((sport) => (
                    <li key={sport}>
                      <Chip label={sport} />
                    </li>
                  ))
                }
              </ul>
              <button className="mt-4 text-sm text-purple-400 underline underline-offset-2"
                style={{
                  border: '.5px solid #202126',
                  padding: '8px',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  backgroundColor: '#202126',
                  color: '#7c3aed'
                }}
                onClick={ () =>
                  window.alert('Método em desenvolvimento')
                }
              >
                Adicionar novo esporte
              </button>
            </div>
          </div>

        </div>

        {/* Exercícios */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Exercícios</h3>
            <span className="text-sm text-muted-foreground">
              {fields.length} exercício{fields.length !== 1 && "s"}
            </span>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="glass rounded-xl p-4 animate-scale-in"
              >
                <div className="flex items-center gap-2 mb-4">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground font-medium">
                    {index + 1}
                  </span>

                  <Input
                    placeholder="Nome do exercício"
                    className="flex-1 h-10 bg-secondary border-0 rounded-lg"
                    {...register(`exercises.${index}.name`, {
                      required: true,
                    })}
                  />

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => remove(index)}
                    className={cn(
                      "text-muted-foreground hover:text-destructive",
                      fields.length === 1 && "opacity-50 pointer-events-none"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Séries
                    </label>
                    <Input
                      type="number"
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                      {...register(`exercises.${index}.sets`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Reps
                    </label>
                    <Input
                      type="number"
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                      {...register(`exercises.${index}.reps`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Carga (kg)
                    </label>
                    <Input
                      type="number"
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                      {...register(`exercises.${index}.weight`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-muted-foreground mb-1 block">
                      Descanso (s)
                    </label>
                    <Input
                      type="number"
                      className="h-10 bg-secondary border-0 rounded-lg text-center"
                      {...register(
                        `exercises.${index}.restTimeSeconds`,
                        { valueAsNumber: true }
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
            Adicionar Exercício
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
