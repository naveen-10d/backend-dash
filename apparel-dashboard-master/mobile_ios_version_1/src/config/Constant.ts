import { Injectable } from '@angular/core';

@Injectable()
export class Constants {
  // API
  // Inventory
  public static get GetAll_Inventory(): string { return '/Inventory/getall/'; }
  public static get User_Create(): string { return '/Inventory/create/'; }
  public static get User_Update(): string { return '/Inventory/update/'; }
  public static get User_Delete(): string { return '/Inventory/delete/'; }
  public static get GetAll_Active_Inventories(): string { return '/Inventory/getallactiveinventory'; }
  public static get GetInventoryByCompanyCode(): string {return '/Inventory/getinventorybycompanycode';}

  //Invoice
  public static get GetallInvoice(): string { return '/Invoices/getall'; }

  // User Management
  public static get get_All_User(): string { return '/User/getall'; }
  public static get create_User(): string { return '/User/create'; }
  public static get disable_User(): string { return '/User/disableuser/'; }
  public static get get_All_User_By_Org(): string { return '/User/getuserByOrganization/'; }

  // User Authorities
  public static get get_All_UserRole(): string { return '/Authorities/getall'; }
  public static get get_UserRole_Details(): string { return '/Authorities/get/'; }
  public static get get_All_UserRole_By_Org(): string { return '/Authorities/getallbyOrganization/'; }
  public static get create_User_Role(): string { return '/Authorities/create'; }
  public static get update_User_Role(): string { return '/Authorities/update'; }
  public static get disable_User_Role(): string { return '/Authorities/disableuserrole/'; }

  // Purchase Order
  public static get get_all_purchase_order(): string { return '/PurchaseOrders/getall'; }
  public static get get_purchase_order_by_organization(): string { return '/PurchaseOrders/org/getall/';}

  // Ticket Creation
  public static get upload_file(): string { return '/file/upload'; }

  //Order
  public static get get_all_order(): string { return '/SalesOrder/getall'; }

  //Shipment
  public static get get_all_shipment(): string { return '/Shipments/getall'; }
  public static get get_shipmentby_id(): string { return '/Shipments/get/'; }

  //Packedbox
  public static get get_packeditems_byid(): string { return '/Shipments/get/packedBoxItem/'; }

  // Dashboard
  public static get get_priority(): string { return '/Ticket/priorityticket/'; }
  
  public static get get_ordersReceived(): string { return '/Order/recevied'; }
  
  public static get get_ordersReceivedToday(): string { return '/Order/receviedToday'; }

  public static get get_ordersShipped(): string { return '/Order/shipment'; }
  
  public static get get_ordersShippedToday(): string { return '/Order/shipmentToday'; }

  public static get get_ordersOnTime(): string { return '/Order/onTime'; }
  
  public static get get_ordersOnTimeToday(): string { return '/Order/onTimeToday'; }

  public static get get_ordersReceivedOrg(): string { return '/Order/Org/recevied/'; }

  public static get get_ordersOnTimeOrg(): string { return '/Order/Org/onTime/'; }
  public static get get_ordersOnTimeTodayOrg(): string { return '/Order/Org/onTimeToday/'; }
  public static get get_ordersReceivedTodayOrg(): string { return '/Order/Org/receviedToday/'; }
  public static get get_ordersShippedOrg(): string { return '/Order/Org/shipment/'; }
  public static get get_ordersShippedTodayOrg(): string { return '/Order/Org/shipmentToday/'; }
  public static get get_priorityOrg(): string { return '/Ticket/Org/priorityticket/'; }



}
