import { inject } from "@angular/core"
import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from "@angular/router"

import { CoursesService } from "../services/courses.service"
import { Course } from "../models/course.model"

export const courseResolver: ResolveFn<Course | null> = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const courseId = route.paramMap.get('courseId')

  if (!courseId) return null

  const courseService = inject(CoursesService)

  return courseService.getCourseById(courseId as string)
}