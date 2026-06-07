from pydantic import BaseModel, ConfigDict, Field, field_validator


ALLOWED_DAYS = {
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
}
ALLOWED_MEAL_TYPES = {"breakfast", "lunch", "dinner", "snack"}


class MealPlanEntryBase(BaseModel):
    day: str
    meal_type: str
    recipe_id: int
    member_id: int

    @field_validator("day")
    @classmethod
    def validate_day(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_DAYS:
            allowed_values = ", ".join(sorted(ALLOWED_DAYS))
            raise ValueError(f"Day must be one of: {allowed_values}")
        return value

    @field_validator("meal_type")
    @classmethod
    def validate_meal_type(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_MEAL_TYPES:
            allowed_values = ", ".join(sorted(ALLOWED_MEAL_TYPES))
            raise ValueError(f"Meal type must be one of: {allowed_values}")
        return value


class MealPlanEntryCreate(MealPlanEntryBase):
    portion_multiplier: float | None = Field(default=None, gt=0)


class MealPlanEntryUpdate(BaseModel):
    day: str | None = None
    meal_type: str | None = None
    recipe_id: int | None = None
    member_id: int | None = None
    portion_multiplier: float | None = Field(default=None, gt=0)

    @field_validator("day")
    @classmethod
    def validate_optional_day(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_DAYS:
            allowed_values = ", ".join(sorted(ALLOWED_DAYS))
            raise ValueError(f"Day must be one of: {allowed_values}")
        return value

    @field_validator("meal_type")
    @classmethod
    def validate_optional_meal_type(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_MEAL_TYPES:
            allowed_values = ", ".join(sorted(ALLOWED_MEAL_TYPES))
            raise ValueError(f"Meal type must be one of: {allowed_values}")
        return value


class MealPlanEntryResponse(MealPlanEntryBase):
    id: int
    portion_multiplier: float
    recipe_name: str | None = None
    member_name: str | None = None

    model_config = ConfigDict(from_attributes=True)


class PortionSuggestionRequest(BaseModel):
    recipe_id: int
    member_id: int


class PortionSuggestionResponse(BaseModel):
    suggested_portion_multiplier: float
    explanation: str
