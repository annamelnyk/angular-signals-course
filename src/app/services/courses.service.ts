import {inject, Injectable} from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {firstValueFrom, Observable} from "rxjs";
import {Course} from "../models/course.model";
import {GetCoursesResponse} from "../models/get-courses.response";


@Injectable({
  providedIn: "root"
})
export class CoursesService {
  http = inject(HttpClient)
  env = environment

  loadAllCourses(): Observable<GetCoursesResponse> {
    const coursesResponse$ = this.http.get<GetCoursesResponse>(`${this.env.apiRoot}/courses`)
    console.log({coursesResponse$})

    // const response = await firstValueFrom(coursesResponse$)

    return coursesResponse$
  }

  createNewCourse(course: Partial<Course>): Promise<Course> {
    const newCourse$ = this.http.post<Course>(`${this.env.apiRoot}/courses`, course)
          
     return firstValueFrom(newCourse$)
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
