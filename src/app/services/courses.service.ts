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


}
