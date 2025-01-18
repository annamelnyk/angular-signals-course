import { afterNextRender, Component, computed, effect, inject, Injector, OnInit, signal } from '@angular/core'
import { CoursesService } from '../services/courses.service'
import { Course, sortCoursesBySeqNo } from "../models/course.model"
import { MatTab, MatTabGroup } from "@angular/material/tabs"
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component"
import { MatDialog } from "@angular/material/dialog"
import { MessagesService } from "../messages/messages.service"
import { catchError, from, throwError } from "rxjs"
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop"
import { CoursesServiceWithFetch } from '../services/courses-fetch.service'
import { EditCourseDialogComponent, openEditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component'
import { LoadingService } from '../loading/loading.service'

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTab,
        CoursesCardListComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    coursesService = inject(CoursesService)
    coursesWithFetchService = inject(CoursesServiceWithFetch)
    loadingService = inject(LoadingService)
    dialog = inject(MatDialog)

    #courses = signal<Course[]>([])

    beginnerCourses = computed(() => this.#courses().filter(({ category }) => category === 'BEGINNER'))
    advancedCourses = computed(() => this.#courses().filter(({ category }) => category === 'ADVANCED'))

    constructor() {
        afterNextRender(() => {
            console.log('2 afterNextRender')
        })
    }

    ngOnInit() {
        console.log('1 ngOnInit')
        this.loadCourses()
    }

    loadCourses() {
        //const coursesList = await this.coursesWithFetchService.loadAllCourses()
        this.coursesService.loadAllCourses().subscribe(
            (response) => {

                this.#courses.set(response.courses.sort(sortCoursesBySeqNo))
            }
        )
    }

    async addCourse() {
        const createdCourse = await openEditCourseDialogComponent(this.dialog, {
            mode: 'create',
            title: 'Create Course'
        })

        if (createdCourse) {
            this.#courses.update(prev => [...prev, createdCourse])
        }

    }

    async deleteCourse(course: Course) {
        try {
            await this.coursesService.deleteCourse(course.id)

            const updated = this.#courses().filter(c => c.id !== course.id)
            this.#courses.set(updated)
        } catch (err) {
            console.error(err)
        }
    }

    updateCourseInUI(course: Course) {
        console.log('in updateCourseinUI ', { course })
        const updated = this.#courses().map(c => c.id === course.id ? course : c)
        this.#courses.set(updated)
    }
}
