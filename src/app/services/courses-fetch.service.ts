import { appConfig } from './../app.config';
import { Injectable, resource } from '@angular/core';
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

  async createNewCourse(course: Partial<Course>): Promise<Course> {
   const response = await fetch(`${this.env.apiRoot}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(course)
   })
    
    const createdCourse = await response.json()
    
    return createdCourse
  }

  async saveCourse(courseId: string, course: Partial<Course>): Promise<Course> {
    const response = await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(course)
   })
    
    return response.json()    
  }

  async deleteCourse(courseId: string): Promise<void> {
    await fetch(`${this.env.apiRoot}/courses/${courseId}`, {
      method: 'DELETE'
    }) 
  }


}
