import { afterNextRender, Component, computed, effect, ElementRef, inject, Injector, OnInit, signal, viewChild } from '@angular/core'
import { CoursesService } from '../services/courses.service'
import { Course, sortCoursesBySeqNo } from "../models/course.model"
import { MatTab, MatTabGroup } from "@angular/material/tabs"
import { CoursesCardListComponent } from "../courses-card-list/courses-card-list.component"
import { MatDialog } from "@angular/material/dialog"
import { MatTooltip } from "@angular/material/tooltip"
import { MessagesService } from "../messages/messages.service"
import { catchError, from, throwError } from "rxjs"
import { toObservable, toSignal, outputToObservable, outputFromObservable } from "@angular/core/rxjs-interop"
import { CoursesServiceWithFetch } from '../services/courses-fetch.service'
import { EditCourseDialogComponent, openEditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component'
import { LoadingService } from '../loading/loading.service'
import { MatToolbar } from '@angular/material/toolbar'

@Component({
    selector: 'home',
    imports: [
        MatTabGroup,
        MatTooltip,
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
    messagesService = inject(MessagesService)
    injector = inject(Injector)

    #courses = signal<Course[]>([])
    courses$ = toObservable(this.#courses)
    loadedCourses$ = this.coursesService.loadAllCourses()

    beginnerCourses = computed(() => this.#courses().filter(({ category }) => category === 'BEGINNER'))
    advancedCourses = computed(() => this.#courses().filter(({ category }) => category === 'ADVANCED'))

    // get the component
    //queriedBeginnerCourses = viewChild<CoursesCardListComponent>('beginnerCourses') 

    // get the Element
    // queriedBeginnerCourses = viewChild('beginnerCourses', {
    //     read: ElementRef
    // })

    //get the directive matTooltip
    queriedBeginnerCourses = viewChild('beginnersCourses', {
        // can query anything from template
        read: MatTooltip
    })



    constructor() {
        // here angular knows the injection context of observable courses$ 
        //this.courses$.subscribe(c => console.log('courses ', c))
        effect(() => {
            console.log('queriedBeginnerCourses', this.queriedBeginnerCourses())
        })
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
            this.messagesService.showMessage('Course successfully removed', 'success')
            const updated = this.#courses().filter(c => c.id !== course.id)
            this.#courses.set(updated)
        } catch (err: unknown | any) {
            const message: string = err?.message ?? 'Error occurred'

            this.messagesService.showMessage(message, 'error')
        }
    }

    updateCourseInUI(course: Course | undefined) {
        if (!course) return
        console.log('in updateCourseinUI ', { course })
        const updated = this.#courses().map(c => c.id === course.id ? course : c)
        this.#courses.set(updated)
    }

    onToObservableExample() {
        const courses$ = toObservable(this.#courses, {
            injector: this.injector
        })

        courses$.subscribe(console.log)
    }

    onToSignalExample() {
        const allCourses = toSignal(this.loadedCourses$, {
            injector: this.injector
        })

        effect(() => {
            console.log('allCourses ', allCourses())
        }, {
            injector: this.injector
        })
    }
}
