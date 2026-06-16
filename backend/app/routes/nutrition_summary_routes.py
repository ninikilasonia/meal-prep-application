from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.nutrition_summary_schema import MemberNutritionSummaryResponse
from app.services import nutrition_summary_service


router = APIRouter(prefix="/nutrition-summary", tags=["nutrition-summary"])


@router.get("", response_model=list[MemberNutritionSummaryResponse])
def get_nutrition_summary(
    db: Session = Depends(get_db),
) -> list[MemberNutritionSummaryResponse]:
    return nutrition_summary_service.calculate_planned_nutrition_by_member(db)
