import { Component, ElementRef, inject, signal, viewChild } from '@angular/core'
import { LessonsService } from '../services/lessons.service'
import { Lesson } from "../models/lesson.model"
import { LessonDetailComponent } from "./lesson-detail/lesson-detail.component"
import { MessagesService } from '../messages/messages.service'

@Component({
    selector: 'lessons',
    imports: [
        LessonDetailComponent
    ],
    templateUrl: './lessons.component.html',
    styleUrl: './lessons.component.scss'
})
export class LessonsComponent {
    mode = signal<'master' | 'detail'>('master')
    lessons = signal<Lesson[]>([])
    selectedLesson = signal<Lesson | null>(null)
    lessonsService = inject(LessonsService)
    messagesService = inject(MessagesService)
    searchInput = viewChild<ElementRef>('search')

    async onSearch() {
        const query = this.searchInput()?.nativeElement.value
        console.log({ query })

        const lessons = await this.lessonsService.loadLessons({ query })

        if (lessons) {
            this.lessons.set(lessons)
        }
    }

    onLessonSelected(lesson: Lesson) {
        this.mode.set('detail')
        this.selectedLesson.set(lesson)
    }

    onLessonUpdated(lesson: Lesson) {
        this.lessons.update(prevLessons => prevLessons
            .map(l => l.id === lesson.id ? lesson : l))
    }

    onCancel() {
        this.mode.set('master')
    }
}
