import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    app = fixture.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('test onSelectChange method', () => {
    component.onSelectChange();
    expect(component.searchType).toBeDefined();
  });

  it('test onInputChange method', () => {
    component.onInputChange();
    expect(component.searchTerm).toBeDefined();
    expect(component.showGrid).toBeFalsy();
  });

  it('test animateToCenter method', () => {
    component.animateToCenter();
    expect(component.inputState).toBeDefined();
    expect(component.inputStateResults).toBeDefined();
  });

  it('test animateToTop method', () => {
    component.animateToTop();
    expect(component.inputState).toBeDefined();
    expect(component.inputStateResults).toBeDefined();
  });

});
