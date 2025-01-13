import {Component, inject, input, output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {Course} from "../models/course.model";
import {MatDialog} from "@angular/material/dialog";
import {EditCourseDialogComponent, openEditCourseDialogComponent} from '../edit-course-dialog/edit-course-dialog.component'

@Component({
    selector: 'courses-card-list',
    imports: [
        RouterLink
    ],
    templateUrl: './courses-card-list.component.html',
    styleUrl: './courses-card-list.component.scss'
})
export class CoursesCardListComponent {
    courses = input.required<Course[]>({
        alias: 'inputData'
    })
    onDeleteCourse = output<Course>()
    dialog = inject(MatDialog)

    async onEditCourse(course: Course) {
        const updatedCourse = await openEditCourseDialogComponent(this.dialog, {
            mode: 'update',
            title: 'Edit Course',
            course
        })

        console.log({updatedCourse})
        if(updatedCourse) {
            await this.onEditCourse(updatedCourse)
        }
    }

    removeCourse(course: Course) {
        this.onDeleteCourse.emit(course)

    }

}
