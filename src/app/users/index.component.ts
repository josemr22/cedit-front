import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { User } from './interfaces/user.interface';
import { UsersService } from './services/users.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
})
export class IndexComponent implements OnInit {
  @ViewChild('dt') dt!: ElementRef;

  _users: User[] = [];
  cols!: any[];
  exportColumns!: any[];

  isLoading: boolean = true;

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this._users = users;
      this.isLoading = false;
    });

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'name', header: 'Nombre' },
      { field: 'email', header: 'Usuario' },
      { field: 'role', header: 'Rol' },
    ];

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
  }

  get users() {
    return this._users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roles[0]?.name,
    }));
  }

  delete(id: number) {
    this.userService.deleteUser(id).subscribe((_) => {
      alert('Usuario Eliminado');
      const idx = this._users.findIndex((u) => u.id == id);
      this._users.splice(idx, 1);
    });
  }

  exportPdf() {
    // import('jspdf').then((jsPDF) => {
    //   import('jspdf-autotable').then((x) => {
    //     const doc = new jsPDF.default('portrait', 'px');
    //     doc.autoTable(this.exportColumns, this.users);
    //     doc.save('products.pdf');
    //   });
    // });
    console.log('pdf');
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const data = this.users.map((u) => {
        const { id, ...rest } = u;
        return rest;
      });
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'usuarios');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
