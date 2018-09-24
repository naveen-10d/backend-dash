import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class Constants {
  // API
  // Inventory
  public static get GetAll_Inventory(): string { return '/Inventory/getall/'; }
  public static get User_Create(): string { return '/Inventory/create/'; }
  public static get User_Update(): string { return '/Inventory/update/'; }
  public static get User_Delete(): string { return '/Inventory/delete/'; }
  public static get GetAll_Active_Inventories(): string { return '/Inventory/getallactiveinventory'; }
  public static get GetInventoryByCompanyCode(): string { return '/Inventory/getinventorybycompanycode'; }

  // Inventory Items
  public static get GetAllInventoryItems(): string { return '/InventoryItems/getall'; }

  // User Management
  public static get get_All_User(): string { return '/User/getall'; }
  public static get create_User(): string { return '/User/create'; }
  public static get update_User(): string { return '/User/update'; }
  public static get disable_User(): string { return '/User/disableuser/'; }
  public static get get_All_User_By_Org(): string { return '/User/getuserByOrganization/'; }
  public static get get_UserData(): string { return '/User/get/'; }
  public static get get_user(): string { return '/User/Username/'; }


  // User Authorities
  public static get get_All_UserRole(): string { return '/Authorities/getall'; }
  public static get get_UserRole_Details(): string { return '/Authorities/get/'; }
  public static get get_All_UserRole_By_Org(): string { return '/Authorities/getallbyOrganization/'; }
  public static get create_User_Role(): string { return '/Authorities/create'; }
  public static get update_User_Role(): string { return '/Authorities/update'; }
  public static get disable_User_Role(): string { return '/Authorities/disableuserrole/'; }
  public static get get_role(): string { return '/Authorities/role/'; }
  public static get get_roleWorg(): string { return '/Authorities/roleWorg/'; }

  // Purchase Order
  public static get get_all_purchase_order(): string { return '/PurchaseOrders/getall'; }
  public static get get_all_purchase_order_by_org(): string { return '/PurchaseOrders/org/getall/'; }
  public static get getFilterValues(): string { return '/PurchaseOrders/getFilterValue'; }

  // Ticket
  public static get upload_file(): string { return '/file/upload'; }
  public static get update_Ticket(): string { return '/Ticket/update'; }
  public static get Reopen_ticket(): string { return '/Ticket/Reopenticket'; }
  public static get createAssignedUserTicket(): string { return '/assignedUserTicket/create'; }
  public static get LogHistory(): string { return '/TicketHistory/create'; }
  public static get GetTickethistroy(): string { return '/TicketHistory/get'; }
  public static get Searchcomments(): string { return '/TicketComment/getTicketsByComment/'; }
  public static get OrgSearchcomments(): string { return '/TicketComment/getTicketsByCommentCode/'; }
  // Mail
  public static get send_Mail(): string { return '/Mail/send'; }

  // CloseReason

  public static get getcloseReason(): string { return '/CloseReason/getreason'; }

  // Organization
  public static get orgGetAll(): string { return '/Organization/getall'; }
  public static get uploadImage(): string { return '/Organization/upload'; }

  // Dashboard
  public static get get_priority(): string { return '/Ticket/priorityticket/'; }
  public static get get_priorityOrg(): string { return '/Ticket/Org/priorityticket/'; }


  public static get get_ordersReceived(): string { return '/Order/recevied'; }

  public static get get_ordersOnTime(): string { return '/Order/onTime'; }
  public static get get_ordersOnTimeToday(): string { return '/Order/onTimeToday'; }

  public static get get_ordersTopSelling(): string { return '/Order/topSelling/'; }
  public static get get_ordersReceivedToday(): string { return '/Order/receviedToday'; }
  public static get get_ordersShipped(): string { return '/Order/shipment'; }
  public static get get_ordersShippedToday(): string { return '/Order/shipmentToday'; }
  public static get get_ordersOnTimeShipped(): string { return '/Order/onTimeShipped/'; }
  public static get get_ordersOnTimeForecast(): string { return '/Order/onTimeForecast/'; }

  public static get get_barGraphDataShipped(): string { return '/Order/shipmentBarGraph/'; }
  public static get get_timeGraphData(): string { return '/Order/forcasted/'; }

  public static get get_barGraphData(): string { return '/Order/receviedBarGraph/'; }

  // ---Org Dashboard

  public static get get_ordersReceivedOrg(): string { return '/Order/Org/recevied/'; }

  public static get get_ordersOnTimeOrg(): string { return '/Order/Org/onTime/'; }
  public static get get_ordersOnTimeTodayOrg(): string { return '/Order/Org/onTimeToday/'; }

  public static get get_ordersTopSellingOrg(): string { return '/Order/Org/topSelling/'; }
  public static get get_ordersReceivedTodayOrg(): string { return '/Order/Org/receviedToday/'; }
  public static get get_ordersShippedOrg(): string { return '/Order/Org/shipment/'; }
  public static get get_ordersShippedTodayOrg(): string { return '/Order/Org/shipmentToday/'; }
  public static get get_ordersOnTimeShippedOrg(): string { return '/Order/Org/onTimeShipped/'; }
  public static get get_ordersOnTimeForecastOrg(): string { return '/Order/Org/onTimeForecast/'; }

  public static get get_barGraphDataShippedOrg(): string { return '/Order/Org/shipmentBarGraph/'; }
  public static get get_timeGraphDataOrg(): string { return '/Order/Org/forcasted/'; }

  public static get get_barGraphDataOrg(): string { return '/Order/Org/receviedBarGraph/'; }

  // SyncService
  public static get get_allSyncService(): string { return '/getsyncservice/getall'; }
}
