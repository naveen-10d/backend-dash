import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IOrganization } from '../IOrganization';
import { OrganizationService } from '../organization.service';
import { ConfigService } from '../../config/config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Constants } from '../../config/Constant';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../../shared/shared.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public imageshow: any;
  public update = false;
  public uuid: any;
  public orgUUID;
  public isImage = false;
  public organization: IOrganization = {
    'id': 0,
    'uuid': '',
    'organizationname': '',
    'orgImage': '',
    'PolypmCompanyCode': ''
  };
  public token;
  public uploader: FileUploader = new FileUploader({
    url: '',
    authTokenHeader: '',
    authToken: '',
    isHTML5: true,
  });
  public createOrgnization: any;

  public Uploadresponse: any;

  public localUrl: any;

  public baseurl: any;

  public editimage: any;

  public location: any;

  public orgninfo: any;

  constructor(private router: Router, private route: ActivatedRoute, private config: ConfigService,
    private organizationService: OrganizationService, private configService: ConfigService, private http: HttpClient,
    private domSanitizer: DomSanitizer, private service: SharedService) {
    if (JSON.parse(sessionStorage.getItem('currentUser')).user.organization) {
      this.orgUUID = JSON.parse(sessionStorage.getItem('currentUser')).user.organization.uuid;
    }
  }

  ngOnInit() {
    this.imageshow = false;
    this.getquerydetails();
    this.currentUserDetails();
    this.uploader.queue.length = 0;
    const URL = this.config.api_url + Constants.uploadImage;
    this.uploader.onBeforeUploadItem = (item) => {
      item.url = URL + '';
    };
    this.uploader.authTokenHeader = 'Authorization';
    this.uploader.authToken = 'Bearer ' + this.token;

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {

      if (this.update === true) {
        this.orgninfo = {
          'organizationname': this.organization.organizationname,
          'uuid': this.uuid,
          'orgImage': JSON.parse(response).path,
          'PolypmCompanyCode': this.organization.PolypmCompanyCode
        };
      } else {
        this.orgninfo = {
          'organizationname': this.createOrgnization.organizationname,
          'uuid': this.createOrgnization.uuid,
          'orgImage': JSON.parse(response).path,
          'PolypmCompanyCode': this.createOrgnization.PolypmCompanyCode
        };
      }
      this.organizationService.updateOrganization(this.orgninfo).subscribe(data => {
        this.router.navigate(['/organization']);
      }, error => {
        console.log(error);
      });


    };
  }

  currentUserDetails() {
    const json = JSON.parse(sessionStorage.getItem('currentUser'));
    this.token = json.token;
    // this.currentUser = json.user;
  }

  omit_special_char(event) {
    let k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32);
  }

  createOrg() {
    // this.update = false;
    console.log('create organization before are ------ ' , this.organization);
    const orginfo = {
      'organizationname': this.organization.organizationname,
      'PolypmCompanyCode': this.organization.PolypmCompanyCode
    };
    this.organizationService.saveOrganization(orginfo).subscribe(
      data => {
        this.createOrgnization = data;
        this.router.navigate(['/organization']);
        this.uploader.uploadAll();
      },
      error => {
        console.log(error);
      });
  }
  getquerydetails() {
    this.route.queryParams.subscribe(params => {
      this.uuid = params['id'];
      if (this.uuid === undefined) {
        this.update = false;
      } else {
        this.update = true;
        this.organizationService.getOrganizationbyid(this.uuid).subscribe(data => {
          this.organization = data;
          this.baseurl = this.service.baseUrl;
          this.editimage = this.organization.orgImage;
          this.location = this.baseurl + '/' + this.editimage;
        }, error => { });

      }
    });
  }


  updateOrg() {
    if (this.localUrl === undefined) {
      const orgninfo = {
        'organizationname': this.organization.organizationname,
        'uuid': this.uuid,
        'orgImage': this.organization.orgImage,
        'PolypmCompanyCode': this.organization.PolypmCompanyCode
      };
      this.organizationService.updateOrganization(orgninfo).subscribe(data => {
        // this.uploader.uploadAll();
      }, error => {
        console.log(error);
      });
      this.router.navigate(['/organization']);

    } else {
      const orgninfo = {
        'organizationname': this.organization.organizationname,
        'uuid': this.uuid,
        'orgImage': this.localUrl.changingThisBreaksApplicationSecurity,
        'PolypmCompanyCode': this.organization.PolypmCompanyCode
      };
      this.organizationService.updateOrganization(orgninfo).subscribe(data => {
        this.uploader.uploadAll();
      }, error => {
        console.log(error);
      });
      this.router.navigate(['/organization']);
    }
  }

  Previewimage(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.isImage = true;
      const reader = new FileReader();
      // tslint:disable-next-line:no-shadowed-variable
      reader.onload = (event: any) => {
        this.imageshow = true;
        this.localUrl = this.domSanitizer.bypassSecurityTrustUrl(event.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

}
