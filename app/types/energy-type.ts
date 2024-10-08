export interface iPEA {
  date: string;
  usage: number;
  err?: any;
}

export interface iElecWAC {
  f_date: string;
  f_prodline: string;
  f_consumption: number;
}

export interface iGas {
  assetDescription: string;
  assetTitle: string;
  assetType: string;
  channelNumber: string;
  city: string;
  country: string;
  customerName: string;
  dataAge: number;
  dataChannelDescription: string;
  dataChannelType: number;
  domainName: string;
  ftpDomain: any;
  ftpEnabled: number;
  ftpId: any;
  importanceLevelImage: number;
  eventImportanceLevel: any;
  installedTechName: string;
  inventoryState: string;
  percentFull: any;
  productDescription: any;
  reading: any;
  readingTime: string;
  rtuDeviceId: string;
  scheduledRefill: any;
  siteTimeZoneDisplayName: string;
  state: string;
  status: string;
  streetAddress: string;
  customField1: string;
  customField2: string;
  customField3: string;
  customField4: string;
  customField5: string;
  customField6: any;
  customField7: any;
  customField8: any;
  customField9: any;
  customField10: any;
  assetId: string;
  dataChannelId: string;
  scaledUnits: string;
  scaledReading: number;
  scaledAlarmLevels: string;
  scaledDeliverable: any;
  displayUnits: string;
  displayReading: number;
  displayAlarmLevels: string;
  displayDeliverable: any;
  percentFullDeliverable: any;
  percentFullAlarmLevels: string;
  eventInventoryStatusId: any;
  displayPriority: number;
  hasMissingData: number;
  dataChannel_SiteNumber: any;
  asset_SiteNumber: any;
  tankType: any;
}
