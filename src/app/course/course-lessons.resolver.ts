import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router"
import { inject } from "@angular/core"

import { Lesson } from "../models/lesson.model"
import { LessonsService } from "../services/lessons.service"

export const courseLessonsResolver = async (route: ActivatedRouteSnapshot, state: ActivatedRouteSnapshot) => {
  const courseId = route.paramMap.get('courseId')

  if (!courseId) {
    return []
  }

  const lessonsService = inject(LessonsService)
  return lessonsService.loadLessons({ courseId })
}