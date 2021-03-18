import { trigger, state, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { createAction, props, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { APP_TEXT, CENTER_STYLE, MOBILE_CENTER_STYLE, MOBILE_TOP_STYLE, REPOSITORIES, TOP_STYLE, USERS } from './common/global-constants';
import { ActionTypes } from './store/store.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('inputStateResults', [
      state(CENTER_STYLE, style({
        transform: 'translate(0%, 6%)',
      })),
      state(MOBILE_CENTER_STYLE, style({
        transform: 'translate(0%, 2%)',
      })),
      state(MOBILE_TOP_STYLE, style({
        transform: 'translate(0%, 0%)',
      })),
      transition('center => top', animate(300)),
      transition('top => center', animate(300)),
      transition('mobilecenter => top', animate(300)),
      transition('top => mobilecenter', animate(300)),
    ]),
    trigger('inputState', [
      state(CENTER_STYLE, style({
        transform: 'translate(0%, 130%)',
        width: '60%'
      })),
      state(TOP_STYLE, style({
        transform: 'translate(0%, 0%)',
        width: '92%'
      })),
      state(MOBILE_CENTER_STYLE, style({
        transform: 'translate(0%, 130%)',
        width: '100%'
      })),
      state(MOBILE_TOP_STYLE, style({
        transform: 'translate(0%, 0%)',
        width: '100%'
      })),
      transition('center => topleft', animate(300)),
      transition('topleft => center', animate(300)),
      transition('mobilecenter => top', animate(300)),
      transition('top => mobilecenter', animate(300))
    ])
  ]
})

export class AppComponent implements OnInit {
  public innerWidth: any;
  inputState = CENTER_STYLE;
  inputStateResults = CENTER_STYLE;
  form: FormGroup;
  results: {} = {};
  appState: any;
  fetchingResults = false;
  searchTerm = '';
  searchType = USERS;
  selectSearchTypeSubscription: Subscription = new Subscription();
  searchInputSubscription: Subscription = new Subscription();
  page = 1;
  pageRequested = false;
  appLabels = APP_TEXT;
  showGrid = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private store: Store) {
    this.form = this.formBuilder.group({
      input: [''],
      select: [USERS],
    });
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.inputState = MOBILE_CENTER_STYLE;
    } else {
      this.inputState = CENTER_STYLE;
    }
  }

  ngOnInit(): void {
    this.store.subscribe((state: any) => {
      this.appState = state;
    });
    this.onSelectChange();
    this.onInputChange();
  }

  /*
  * @methodName onSelectChange
  * @parameter none
  * @description fetch results on select box change
  * @return none
  */
  onSelectChange(): void {
    this.selectSearchTypeSubscription = this.form.get('select')!.valueChanges.subscribe((value) => {
      this.results = {};
      this.page = 0;
      this.searchType = value;
      if (this.form.get('input')?.value.length >= 3) {
        this.fetchSearchResults(value, this.form.get('input')!.value);
      } else {
        this.refreshStore(this.searchTerm, value);
      }
    });
  }

  /*
  * @methodName onInputChange
  * @parameter none
  * @description fetch results on input change
  * @return none
  */
  onInputChange(): void {
    this.searchInputSubscription = this.form.get('input')!.valueChanges
      .pipe(
        debounceTime(1000)
      )
      .subscribe((value) => {
        this.page = 0;
        if (value.length >= 3) {
          this.showGrid = true;
          this.animateToTop();
          this.searchTerm = value;
          if (this.searchType === USERS && !(value in this.appState.appReducer.user)) {
            this.fetchSearchResults(this.searchType, value);
          } else if (this.searchType === REPOSITORIES && !(value in this.appState.appReducer.repo)) {
            this.fetchSearchResults(this.searchType, value);
          } else {
            this.refreshStore(value, this.searchType);
          }
        } else if (value.length < 3) {
          this.animateToCenter();
          this.showGrid = false;
        } else {
          this.showGrid = false;
        }
      });
  }

  /*
  * @methodName selectSearchType
  * @parameter none
  * @description get search type value
  * @return string
  */
  get selectSearchType(): string {
    return this.form.get('select')!.value;
  }

  /*
  * @methodName searchInput
  * @parameter none
  * @description get search input value
  * @return string
  */
  get searchInput(): string {
    return this.form.get('input')!.value;
  }

  /*
  * @methodName checkResults
  * @parameter none
  * @description check api result length
  * @return boolean
  */
  checkResults(): boolean {
    return (Object.keys(this.results).length > 0 && this.showGrid);
  }

  /*
  * @methodName fetchSearchResults
  * @parameter searchType, searchKeyword, page
  * @description fetch api results
  * @return none
  */
  fetchSearchResults(searchType: string, searchKeyword: string, page: number = 1): void {
    this.fetchingResults = true;
    this.http.get(`https://api.github.com/search/${searchType.toLowerCase()}?q=${searchKeyword}&page=${page}&per_page=100`)
      .subscribe(res => {
        const actionName = '';
        if (page === 1) {
          this.fetchInitialResults(searchType, actionName, searchKeyword, res);
        } else {
          this.fetchInfiniteResults(searchType, actionName, searchKeyword, res);
        }
      },
        (error) => {
          this.fetchingResults = false;
          if (error.status === 0) {
            alert('Network Error!');
          } else {
            alert('Unknown API Error!');
          }
          throw error.status;
        }
      );
  }

  /*
  * @methodName fetchInitialResults
  * @parameter searchType, searchKeyword, actionName, res
  * @description fetch api results
  * @return none
  */
  fetchInitialResults(searchType: string, actionName: string, searchKeyword: string, res: any): void {
    if (searchType === USERS) {
      actionName = ActionTypes.AddUsers;
    } else {
      actionName = ActionTypes.AddRepos;
    }
    const addResultsAction = createAction(
      actionName,
      props<{ id: string, payload: {} }>()
    );
    this.store.dispatch(addResultsAction({
      id: searchKeyword,
      payload: res
    }));
    this.results = res;
    this.fetchingResults = false;
  }

  /*
  * @methodName fetchInfiniteResults
  * @parameter searchType, searchKeyword, actionName, res
  * @description fetch api results
  * @return none
  */
    fetchInfiniteResults(searchType: string, actionName: string, searchKeyword: string, res: any): void {
      if (searchType === USERS) {
        actionName = ActionTypes.UpdateUsers;
      } else {
        actionName = ActionTypes.UpdateRepos;
      }
      const updateResultAction = createAction(
        actionName,
        props<{ id: string, payload: {} }>()
      );
      this.store.dispatch(updateResultAction({
        id: searchKeyword,
        payload: res
      }));
      this.pageRequested = false;
      this.fetchingResults = false;
    }

  /*
  * @methodName animateToCenter
  * @parameter none
  * @description animate form to center
  * @return none
  */
  animateToCenter(): void {
    if (this.innerWidth <= 768) {
      this.inputState = MOBILE_CENTER_STYLE;
      this.inputStateResults = MOBILE_CENTER_STYLE;
    } else {
      this.inputState = CENTER_STYLE;
      this.inputStateResults = CENTER_STYLE;
    }
  }

  /*
  * @methodName animateToTop
  * @parameter none
  * @description animate form to center
  * @return none
  */
  animateToTop(): void {
    if (this.innerWidth <= 768) {
      this.inputState = MOBILE_TOP_STYLE;
    } else {
      this.inputState = TOP_STYLE;
    }
    this.inputStateResults = MOBILE_TOP_STYLE;

  }

  /*
  * @methodName scrollHandler
  * @parameter none
  * @description handle infinite scroll
  * @return none
  */
  @HostListener('window:scroll', ['$event'])
  scrollHandler(): void {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop);
    const max = document.documentElement.scrollHeight;
    if (Math.floor((pos / max) * 100) > 60  &&  Math.floor((pos / max) * 100) < 70 && !this.pageRequested && this.page < 11) {
      this.page = this.page + 1;
      this.pageRequested = true;
      this.fetchSearchResults(this.searchType, this.searchTerm, this.page + 1);
    } else if (this.page > 10){
      alert('Max results reached!');
    }
  }

  /*
  * @methodName refreshStore
  * @parameter none
  * @description refresh store values
  * @return none
  */
  refreshStore(searchTerm: string = '', searchType: string = ''): void {
    let actionName = '';
    let payload = '';
    if (searchType === '' && searchTerm !== '') {
      actionName = ActionTypes.UpdateSearchTerm;
      payload = searchTerm;
    } else if (searchTerm === '' && searchType !== '') {
      actionName = ActionTypes.UpdateSearchType;
      payload = searchType;
    }
    const refreshStore = createAction(
      actionName,
      props<{ id: string, payload: {} }>()
    );
    this.store.dispatch(refreshStore({
      id: '',
      payload
    }));
  }
}
