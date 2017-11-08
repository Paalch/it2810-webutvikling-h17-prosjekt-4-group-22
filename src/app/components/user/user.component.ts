import { Component, OnInit } from '@angular/core'

import { UserService } from 'services/user.service'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

    constructor(private userService: UserService) { }

    async ngOnInit(): Promise<void> {
        await this.userService.getUser()
    }
}