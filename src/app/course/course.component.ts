import { Component, inject, OnInit, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { Course } from '../models/course.model'
import { Lesson } from '../models/lesson.model'
import { LessonsService } from '../services/lessons.service';
import { MessagesService } from '../messages/messages.service'

@Component({
  selector: 'course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit{
  course = signal<Course | null>(null)
  lessons = signal<Lesson[]>([])

  route = inject(ActivatedRoute)
  lessonsService = inject(LessonsService)
  messagesService = inject(MessagesService)

  ngOnInit() {
    this.course.set(this.route.snapshot.data['course'])
    this.lessons.set(this.route.snapshot.data['lessons'])
    console.log(this.route.snapshot.data['lessons'])
  }

}
