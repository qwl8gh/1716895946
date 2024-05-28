import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly baseUrl = process.env.VUE_APP_AMOCRM_API_URL;
  private readonly authToken = `Bearer ${process.env.VUE_APP_ACCESS_TOKEN}`;

  constructor(private readonly httpService: HttpService) {}

  private transformData(leads: any, contactsMap: any, usersMap: any, statusMap: any) {
    return leads._embedded.leads.map(lead => ({
      id: lead.id,
      status_id: lead.status_id,
      pipeline_id: lead.pipeline_id,
      responsible_user_id: lead.responsible_user_id,
      name: lead.name,
      price: lead.price,
      created_by: lead.created_by,
      created_at: lead.created_at,
      contact_id: contactsMap[lead._embedded.companies[0]?.id].id,
      company_id: lead._embedded.companies[0]?.id,
      contact: contactsMap[lead._embedded.companies[0]?.id] || {},
      user: usersMap[lead.responsible_user_id] || {},
      status: statusMap[lead.status_id] || {},
    }));
  }
  
  async getAllData() {
    const [leads, contacts, users, pipelines] = await Promise.all([
      this.fetchData('/leads'),
      this.fetchData('/contacts'),
      this.fetchData('/users'),
      this.fetchData('/leads/pipelines'),
    ]);

    const contactsMap = this.createContactMap(contacts._embedded.contacts);
    const usersMap = this.createUserMap(users._embedded.users);
    const statusMap = this.createStatusMap(pipelines._embedded.pipelines);
    return this.transformData(leads, contactsMap, usersMap, statusMap); 
  }

  async getFilteredData(query: string) {
    let queryString = '';
    const leads = await this.fetchQueryData('/leads', `query=${query}`);
    const leadsCompaniesId = leads._embedded.leads.map(lead => lead._embedded.companies[0]?.id).filter(id => id !== undefined);
    queryString = `?${leadsCompaniesId.map(id => `filter[companies]=${id}`).join('&')}`;
    const contacts = await this.fetchQueryData('/contacts', queryString);
    
    const leadsStatusesId = leads._embedded.leads.map(lead => lead.status_id).filter(id => id !== undefined);
    queryString = `?${leadsStatusesId.map(id => `filter[statuses]=${id}`).join('&')}`;
    const pipelines = await this.fetchQueryData('/leads/pipelines', queryString);

    const leadsUsersId = leads._embedded.leads.map(lead => lead.responsible_user_id).filter(id => id !== undefined);
    queryString = `?${leadsUsersId.map(id => `filter[pipeline_id]=${id}`).join('&')}`;
    const users = await this.fetchQueryData('/users', queryString);

    const contactsMap = this.createContactMap(contacts._embedded.contacts);
    const usersMap = this.createUserMap(users._embedded.users);
    const statusMap = this.createStatusMap(pipelines._embedded.pipelines);
    return this.transformData(leads, contactsMap, usersMap, statusMap);
  }

  private async fetchData(endpoint: string) {
    const headers = {
      Authorization: this.authToken,
    };
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}${endpoint}`, { headers }).pipe(map(response => response.data)),
    );
  }

  private async fetchQueryData(endpoint: string, query: string) {
    const headers = {
      Authorization: this.authToken,
    };
    return lastValueFrom(
      this.httpService.get(`${this.baseUrl}${endpoint}?${query}`, { headers }).pipe(map(response => response.data)),
    );
  }

  private createContactMap(data: any[]) {
    return data.reduce((map, item) => {
      map[item._embedded.companies[0]?.id] = {
        id: item.id,
        name: item.name,
        email: item.custom_fields_values?.find(field => field.field_code === 'EMAIL')?.values[0]?.value || '',
        phone: item.custom_fields_values?.find(field => field.field_code === 'PHONE')?.values[0]?.value || '',
      };
      return map;
    }, {});
  }

  private createUserMap(data: any[]) {
    return data.reduce((map, item) => {
      map[item.id] = {
        id: item.id,
        name: item.name,
      };
      return map;
    }, {});
  }

  private createStatusMap(pipelines: any[]) {
    const statusMap = {};
    pipelines.forEach(pipeline => {
      pipeline._embedded.statuses.forEach(status => {
        statusMap[status.id] = {
          id: status.id,
          name: status.name,
          color: status.color,
        };
      });
    });
    return statusMap;
  }
}
