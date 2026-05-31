from pydantic import BaseModel, ConfigDict, Field, field_validator


ALLOWED_SEX_VALUES = {"male", "female", "other"}
ALLOWED_ACTIVITY_LEVELS = {"low", "medium", "high"}
ALLOWED_GOALS = {"lose", "maintain", "gain"}


class HouseholdMemberBase(BaseModel):
    name: str
    age: int = Field(gt=0)
    sex: str
    height: float = Field(gt=0)
    weight: float = Field(gt=0)
    activity_level: str
    goal: str
    dietary_restrictions: str | None = None
    daily_calorie_goal: float = Field(default=0, ge=0)
    daily_protein_goal: float = Field(default=0, ge=0)
    daily_fiber_goal: float = Field(default=0, ge=0)

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator("sex")
    @classmethod
    def validate_sex(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_SEX_VALUES:
            allowed_values = ", ".join(sorted(ALLOWED_SEX_VALUES))
            raise ValueError(f"Sex must be one of: {allowed_values}")
        return value

    @field_validator("activity_level")
    @classmethod
    def validate_activity_level(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_ACTIVITY_LEVELS:
            allowed_values = ", ".join(sorted(ALLOWED_ACTIVITY_LEVELS))
            raise ValueError(f"Activity level must be one of: {allowed_values}")
        return value

    @field_validator("goal")
    @classmethod
    def validate_goal(cls, value: str) -> str:
        value = value.strip().lower()
        if value not in ALLOWED_GOALS:
            allowed_values = ", ".join(sorted(ALLOWED_GOALS))
            raise ValueError(f"Goal must be one of: {allowed_values}")
        return value


class HouseholdMemberCreate(HouseholdMemberBase):
    pass


class HouseholdMemberUpdate(BaseModel):
    name: str | None = None
    age: int | None = Field(default=None, gt=0)
    sex: str | None = None
    height: float | None = Field(default=None, gt=0)
    weight: float | None = Field(default=None, gt=0)
    activity_level: str | None = None
    goal: str | None = None
    dietary_restrictions: str | None = None
    daily_calorie_goal: float | None = Field(default=None, ge=0)
    daily_protein_goal: float | None = Field(default=None, ge=0)
    daily_fiber_goal: float | None = Field(default=None, ge=0)

    @field_validator("name")
    @classmethod
    def validate_optional_name(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()
        if not value:
            raise ValueError("Name cannot be empty")
        return value

    @field_validator("sex")
    @classmethod
    def validate_optional_sex(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_SEX_VALUES:
            allowed_values = ", ".join(sorted(ALLOWED_SEX_VALUES))
            raise ValueError(f"Sex must be one of: {allowed_values}")
        return value

    @field_validator("activity_level")
    @classmethod
    def validate_optional_activity_level(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_ACTIVITY_LEVELS:
            allowed_values = ", ".join(sorted(ALLOWED_ACTIVITY_LEVELS))
            raise ValueError(f"Activity level must be one of: {allowed_values}")
        return value

    @field_validator("goal")
    @classmethod
    def validate_optional_goal(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip().lower()
        if value not in ALLOWED_GOALS:
            allowed_values = ", ".join(sorted(ALLOWED_GOALS))
            raise ValueError(f"Goal must be one of: {allowed_values}")
        return value


class HouseholdMemberResponse(HouseholdMemberBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
