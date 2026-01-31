import { ACADEMIC_XP_LEVELS, WORK_XP_LEVELS } from "./constantes";
import { ProgressLevel } from "./interfaces";
import { CharacterPreview } from "./models/player.model";

export function addAcademicXp(
  character: CharacterPreview,
  xp: number
): CharacterPreview {

  const newXp = character.academicXp + xp;
  const newLevel = calculateLevel(newXp, ACADEMIC_XP_LEVELS);

  return {
    ...character,
    academicXp: newXp,
    academicLevel: newLevel,
  };
}
export function addWorkXp(
  character: CharacterPreview,
  xp: number
): CharacterPreview {

  const newXp = character.workXp + xp;
  let newLevel = calculateLevel(newXp, WORK_XP_LEVELS);

  // 🔒 regla: laboral <= académico + 1
  if (!isWorkLevelAllowed(newLevel, character.academicLevel)) {
    newLevel = character.workLevel;
  }

  return {
    ...character,
    workXp: newXp,
    workLevel: newLevel,
  };
}
function calculateLevel(
  xp: number,
  levels: Record<ProgressLevel, number>
): ProgressLevel {

  return (Object.entries(levels)
    .reverse()
    .find(([_, value]) => xp >= value)?.[0] as ProgressLevel) ?? 'LEVEL_1';
}
function isWorkLevelAllowed(
  workLevel: ProgressLevel,
  academicLevel: ProgressLevel
): boolean {

  const w = Number(workLevel.split('_')[1]);
  const a = Number(academicLevel.split('_')[1]);

  return w <= a + 1;
}
