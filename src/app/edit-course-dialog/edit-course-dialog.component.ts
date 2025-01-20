import { Component, effect, inject, signal } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog"
import { Course } from "../models/course.model"
import { EditCourseDialogData } from './edit-course-dialog.data.model'
import { CoursesService } from "../services/courses.service"
import { LoadingIndicatorComponent } from "../loading/loading.component"
import { FormBuilder, ReactiveFormsModule } from '@angular/forms'
import { CourseCategoryComboboxComponent } from "../course-category-combobox/course-category-combobox.component"
import { CourseCategory } from "../models/course-category.model"
import { firstValueFrom } from 'rxjs'
import { saveCourse } from '../../../server/save-course.route'
import { MessagesService } from '../messages/messages.service'
import { text } from 'body-parser'

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss'
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef)
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA)
  fb = inject(FormBuilder)
  coursesService = inject(CoursesService)
  messagesService = inject(MessagesService)

  form = this.fb.group({
    title: [''],
    longDescription: [''],
    category: [''],
    image: [''],
  })

  constructor() {
    this.form.patchValue({
      title: this.data.course?.title,
      longDescription: this.data.course?.longDescription,
      category: this.data.course?.category,
      image: this.data.course?.iconUrl
    })
  }

  onClose() {
    this.dialogRef.close()
  }

  onSave() {
    const partiallyUpdatedCourse = this.form.value as Partial<Course>
    if (this.data.mode === 'update') {
      console.log('edit course')
      console.log(this.form.value)
      this.saveCourse(this.data?.course!.id, partiallyUpdatedCourse)
    }

    if (this.data.mode === 'create') {
      console.log('create course')
      console.log(this.form.value)
      this.createCourse(partiallyUpdatedCourse)
    }
  }

  // The benefit of moving api call into separate method is in implementing
  // proper error handling
  async saveCourse(courseId: string, course: Partial<Course>) {
    try {
      const updatedCourse = await this.coursesService.saveCourse(courseId, course)
      this.dialogRef.close(updatedCourse)
      this.messagesService.showMessage('Course successfully updated', 'success')
    } catch (err: unknown | any) {
      const message: string = err?.message ?? 'Error occurred'
      this.messagesService.showMessage(message, 'error')
    }
  }

  async createCourse(course: Partial<Course>) {
    try {
      let createdCourse = await this.coursesService.createNewCourse(course)
      this.dialogRef.close(createdCourse)
      this.messagesService.showMessage('Course successfully created', 'success')
    } catch (err: unknown | any) {
      const message: string = err?.message ?? 'Error occurred'
      this.messagesService.showMessage(message, 'error')
    }
  }
}

export async function openEditCourseDialogComponent(dialog: MatDialog, data: EditCourseDialogData) {
  const config = new MatDialogConfig()

  config.autoFocus = true
  config.width = '400px'
  config.data = data

  const close$ = dialog.open(EditCourseDialogComponent, config)
    .afterClosed()

  return firstValueFrom(close$)
}
