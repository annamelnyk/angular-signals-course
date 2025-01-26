import { inject, Injectable } from "@angular/core"
import { HttpClient, HttpContext } from "@angular/common/http"
import { environment } from "../../environments/environment.development"
import { firstValueFrom, Observable } from "rxjs"
import { Course } from "../models/course.model"
import { GetCoursesResponse } from "../models/get-courses.response"
import { SkipLoading } from "../loading/skip-loading.component"
import { getCourseById } from '../../../server/get-courses.route';


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  http = inject(HttpClient)
  env = environment

  loadAllCourses(): Observable<GetCoursesResponse> {
    const coursesResponse$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`, {
      // skip loading by injecting http context token

      //context: new HttpContext().set(SkipLoading, true)
    })
    console.log({ coursesResponse$ })

    // const response = await firstValueFrom(coursesResponse$)

    return coursesResponse$
  }

  createNewCourse(course: Partial<Course>): Promise<Course> {
    const newCourse$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course)

    return firstValueFrom(newCourse$)
  }

  getCourseById(courseId: string): Promise<Course> {
    const course$ = this.http.get<Course>(`${this.env.apiRoot}/courses/${courseId}`)

    return firstValueFrom(course$)
  }

  saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    const updatedCourse$ = this.http.put<Course>(`${this.env.apiRoot}/courses/${courseId}`, course)

    return firstValueFrom(updatedCourse$)
  }

  deleteCourse(courseId: string) {
    const deleteResponse$ = this.http.delete<Observable<void>>(`${this.env.apiRoot}/courses/${courseId}`)

    return firstValueFrom(deleteResponse$)
  }
}
