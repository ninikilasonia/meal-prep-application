from pydantic import BaseModel, Field


class DailyNutritionSummaryResponse(BaseModel):
    day: str
    calories: float = 0
    protein: float = 0
    carbohydrates: float = 0
    fat: float = 0
    fiber: float = 0
    calorie_goal: float = Field(default=0, ge=0)
    protein_goal: float = Field(default=0, ge=0)
    fiber_goal: float = Field(default=0, ge=0)


class WeeklyNutritionSummaryResponse(BaseModel):
    total_calories: float = 0
    total_protein: float = 0
    total_carbohydrates: float = 0
    total_fat: float = 0
    total_fiber: float = 0


class MemberNutritionSummaryResponse(BaseModel):
    member_id: int
    member_name: str
    daily_summary: list[DailyNutritionSummaryResponse] = Field(default_factory=list)
    weekly_summary: WeeklyNutritionSummaryResponse
