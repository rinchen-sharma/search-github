import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let app: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({})
      ],
      declarations: [
        GridComponent
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    app = fixture.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('test getGridData method', () => {
    component.getGridData();
    expect(component.users).toBeDefined();
    expect(component.repos).toBeDefined();
    expect(component.showMessage).toBeFalsy();
  });

});
