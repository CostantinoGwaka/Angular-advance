export interface OpeningReportEntity {
  id: number,
  uuid: string,
  entityUuid: string,
  procurementEntityName: string,
  entityCategoryAcronym: string,
  procuringEntityUuid: string,
  entityStatus: string,
  entityNumber: string,
  frameworkNumber?: string,
  numberOfLots: number,
  description: string,
  financialYearCode: string,
  openingReportUuid: string,
  openingDateTime: string,
  tender: {
    procurementMethod: {
      description: string
    }
  }
  submissionOrOpeningDate: string
}
