import {afterNextRender, Component, computed, effect, inject, Injector, OnInit, signal} from '@angular/core'
import { CoursesService } from '../services/courses.service';
import {Course, sortCoursesBySeqNo} from "../models/course.model"
import {MatTab, MatTabGroup} from "@angular/material/tabs"
import {CoursesCardListComponent} from "../courses-card-list/courses-card-list.component"
import {MatDialog} from "@angular/material/dialog"
import {MessagesService} from "../messages/messages.service"
import {catchError, from, throwError} from "rxjs"
import {toObservable, toSignal, outputToObservable, outputFromObservable} from "@angular/core/rxjs-interop"
import {CoursesServiceWithFetch} from '../services/courses-fetch.service'

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

    #courses = signal<Course[]>([])

    beginnerCourses = computed(() => this.#courses().filter(({category}) => category === 'BEGINNER'))
    advancedCourses = computed(() => this.#courses().filter(({category}) => category !== 'BEGINNER'))

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
}
