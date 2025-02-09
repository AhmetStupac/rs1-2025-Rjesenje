import {Component, OnInit} from '@angular/core';
import {
  StudentGetByIdEndpointService,
  StudentGetByIdResponse
} from '../../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import {AcademicYearResponse, YOSGetResponse} from '../student-semesters.component';
import {StudentDeleteEndpointService} from '../../../../../endpoints/student-endpoints/student-delete-endpoint.service';
import {MySnackbarHelperService} from '../../../../shared/snackbars/my-snackbar-helper.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {
  StudentRestoreEndpointService
} from '../../../../../endpoints/student-endpoints/student-restore-endpoint.service';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../../../../my-config';
import {Location} from '@angular/common';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MyAuthService} from '../../../../../services/auth-services/my-auth.service';

@Component({
  selector: 'app-student-semesters-new',
  standalone: false,

  templateUrl: './student-semesters-new.component.html',
  styleUrl: './student-semesters-new.component.css'
})

export class StudentSemestersNewComponent implements OnInit{
  student: StudentGetByIdResponse | null = null;
  yos: YOSGetResponse[] = [];
  academicYears: AcademicYearResponse[] = [];
  recordedById: number | null = null;

  constructor(
    private studentGetService: StudentGetByIdEndpointService,
    private studentDeleteService: StudentDeleteEndpointService,
    private snackbar: MySnackbarHelperService,
    private router: Router,
    private dialog: MatDialog,
    private studentRestoreService: StudentRestoreEndpointService,
    private route: ActivatedRoute,
    private http: HttpClient,
    protected location : Location,
    private auth: MyAuthService
  ) {}

  form = new FormGroup({
    datumUpisa: new FormControl('', Validators.required),
    godinaStudija: new FormControl(0, [Validators.required, Validators.min(50), Validators.max(2000)]),
    akademskaGodinaId: new FormControl(0, [Validators.required]),
    cijenaSkolarine: new FormControl(0),
    obnova: new FormControl(false)
  })

  ngOnInit(): void {
    this.loadData();

    this.form.get('obnova')!.disable();
    this.form.get('cijenaSkolarine')!.disable();
    this.form.get('datumUpisa')!
      .setValue(new Date().toISOString().split('T')[0]);

    this.form.get('godinaStudija')!.valueChanges.subscribe({
      next: value => {
        if (Number.isInteger(value)) {
          let renewal = this.yos.find(val => val.godinaStudija === value) != undefined;
          this.form.get('obnova')!.setValue(renewal);
          this.form.get('cijenaSkolarine')!.setValue(renewal ? 400 : 1800);
        }
      }
    })
  }

  loadData() {
    this.route.params.subscribe(params => {
      let id = params['id']
      if(id)
      {
        this.studentGetService.handleAsync(id).subscribe(studentGet => {
          this.student = studentGet;
        })

        this.http.get<YOSGetResponse[]>(`${MyConfig.api_address}/yos/get/${id}`).subscribe(yos => {
          this.yos = yos;
          this.form.get('godinaStudija')!.setValue(50);
        })

        this.http.get<AcademicYearResponse[]>(`${MyConfig.api_address}/yos/academic-years`).subscribe(academicYears => {
          this.academicYears = academicYears;
          this.form.get('akademskaGodinaId')!.setValue(this.academicYears[0].id)
        })
      }
    })

    this.recordedById = this.auth.getMyAuthInfo()?.userId ?? null;
  }

  newSemester() {
    if(this.form.valid) {
      let req = {
        studentId: this.student!.id,
        snimioId: this.recordedById!,
        akademskaGodinaId: this.form.get('akademskaGodinaId')!.value,
        godinaStudija: this.form.get('godinaStudija')!.value,
        datumUpisa: this.form.get('datumUpisa')!.value
      }

      this.http.post<number>(`${MyConfig.api_address}/yos/create`, req).subscribe({
        next: value => {
          this.snackbar.showMessage("Successfully created");
          this.location.back();
        },
        error: error => {
          this.snackbar.showMessage("Something went wrong");
        }
      })
    }
  }
}
