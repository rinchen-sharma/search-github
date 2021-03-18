import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CARDS_TEXT, REPOSITORIES, USERS } from '../common/global-constants';
import { Repo, User } from '../models/user-repo';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit, OnDestroy {
    @Input() searchType = '';
    @Input() searchTerm = '';
    subscription$: Subscription;
    appState: any;
    users: Array<User> = [];
    repos: Array<Repo> = [];
    showMessage = false;
    gridLabels = CARDS_TEXT;

    constructor(private store: Store) {
        this.subscription$ = new Subscription();
    }

    ngOnInit(): void {
        this.getGridData();
    }

    /*
    * @methodName getGridData
    * @parameter none
    * @description set users and repo data
    * @return none
    */
    getGridData(): any {
        this.subscription$.add(this.store.subscribe(state => {
            this.appState = state;
            this.showMessage = false;
            if (this.searchType === USERS && this.appState.appReducer.user[this.searchTerm].items) {
                this.users = this.appState.appReducer.user[this.searchTerm].items;
                if (this.users.length === 0) {
                    this.showMessage = true;
                }
                this.users = this.users.map(user => {
                    const { avatar_url, login, html_url } = user;
                    return { avatar_url, login, html_url };
                });
            } else if (this.searchType === REPOSITORIES &&  this.appState.appReducer.repo[this.searchTerm].items) {
                this.repos = this.appState.appReducer.repo[this.searchTerm].items;
                if (this.repos.length === 0) {
                    this.showMessage = true;
                }
                this.repos = this.repos.map(repo => {
                    const { forks_count, full_name, name, stargazers_count, watchers_count, html_url, homepage } = repo;
                    return { forks_count, full_name, name, stargazers_count, watchers_count, html_url, homepage };
                });
            }
        }));
    }

    ngOnDestroy(): void {
        if (this.subscription$) {
            this.subscription$.unsubscribe();
        }

    }
}
