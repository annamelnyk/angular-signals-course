import { appConfig } from './../app.config';
import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment.development";
import {Course} from "../models/course.model";
import { Response } from 'express';


@Injectable({
  providedIn: "root"
})
export class CoursesServiceWithFetch {

  env = environment;

  async loadAllCourses(): Promise<Course[]> {
    const response = await fetch(`${this.env.apiRoot}/courses`)
    const payload = await response.json()

    return payload.courses
  }


}
