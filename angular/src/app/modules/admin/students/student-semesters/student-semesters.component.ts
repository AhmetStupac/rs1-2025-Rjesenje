import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {
  StudentGetAllEndpointService,
  StudentGetAllResponse
} from '../../../../endpoints/student-endpoints/student-get-all-endpoint.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import {StudentDeleteEndpointService} from '../../../../endpoints/student-endpoints/student-delete-endpoint.service';
import {MySnackbarHelperService} from '../../../shared/snackbars/my-snackbar-helper.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {StudentRestoreEndpointService} from '../../../../endpoints/student-endpoints/student-restore-endpoint.service';
import {
  StudentGetByIdEndpointService, StudentGetByIdResponse
} from '../../../../endpoints/student-endpoints/student-get-by-id-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {HttpClient} from '@angular/common/http';

export interface AcademicYearResponse {
  id: number;
  name: string;
}

export interface YOSGetResponse {
  id: number;
  studentId: number;
  akademskaGodinaId: number;
  akademskaGodina: string;
  godinaStudija: number;
  obnova: boolean;
  datumUpisa: string;
  snimio: string;
}

@Component({
  selector: 'app-student-semesters',
  standalone: false,

  templateUrl: './student-semesters.component.html',
  styleUrl: './student-semesters.component.css'
})
export class StudentSemestersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'academicYear', 'year', 'renewal', "date", "recordedBy"];
  dataSource: MatTableDataSource<YOSGetResponse> = new MatTableDataSource<YOSGetResponse>();
  student: StudentGetByIdResponse | null = null;
  yos : YOSGetResponse[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentGetService: StudentGetByIdEndpointService,
    private studentDeleteService: StudentDeleteEndpointService,
    private snackbar: MySnackbarHelperService,
    private router: Router,
    private dialog: MatDialog,
    private studentRestoreService: StudentRestoreEndpointService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadData();
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
          this.dataSource.data = this.yos;
        })
      }
    })
  }

  goToNewSemester() {
    this.router.navigate(['/admin/student/semesters/new', this.student!.id])
  }
}
