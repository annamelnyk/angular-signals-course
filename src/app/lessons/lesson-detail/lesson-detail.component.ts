import { Component, ElementRef, inject, input, output, viewChild } from '@angular/core'
import { Lesson } from "../../models/lesson.model"
import { ReactiveFormsModule } from "@angular/forms"
import { LessonsService } from "../../services/lessons.service"
import { MessagesService } from "../../messages/messages.service"

@Component({
    selector: 'lesson-detail',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './lesson-detail.component.html',
    styleUrl: './lesson-detail.component.scss'
})
export class LessonDetailComponent {
    lesson = input.required<Lesson | null>()
    cancel = output()
    lessonUpdated = output<Lesson>()
    messagesService = inject(MessagesService)
    lessonsService = inject(LessonsService)

    onCancel() {
        this.cancel.emit()
    }

    async updateLesson(description: string) {
        const lesson = this.lesson()

        try {
            const updatedLesson = await this.lessonsService.updateLesson(lesson!.id, { description })
            this.lessonUpdated.emit(updatedLesson)

        } catch (err) {
            this.messagesService.showMessage('Update lesson failed', 'error')
        }
    }
}
