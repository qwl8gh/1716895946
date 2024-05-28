<template>
    <a-card title="Таблица" :bordered="false" style="width: auto">
      <template #extra>
        <a-input-search
          v-model:value="searchText"
          placeholder="Найти..."
          style="width: 200px"
          @search="onSearch"
        />
      </template>
      <a-spin :spinning="loading">
        <a-table 
          :pagination="false"
          :columns="columns"
          :row-key="record => record.id"
          :data-source="dataSource" 
          @expand="handleExpand">
          <template #expandedRowRender="record">
            <div class="contact-box">
              <a-avatar size="small">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="contact-name">{{record.record.contact.name}}</span>
              <ul class="contact-list">
                <li>
                  <a :href="'tel:' + record.record.contact.phone">
                    <PhoneOutlined />
                  </a>
                </li>
                <li>
                  <a-divider type="vertical" />
                </li>
                <li>
                  <a :href="'mailto:' + record.record.contact.email">
                    <MailOutlined />
                  </a>
                </li>
              </ul>
            </div>
          </template>
        </a-table>
      </a-spin>
      </a-card>
</template>

<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { UserOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons-vue';
  import { ColumnsType } from 'ant-design-vue/es/table';
  import { Avatar } from 'ant-design-vue';
  import axios from 'axios';

  interface Contact {
    id: number;
    name: string;
    email: string;
    phone: string;
  }

  interface User {
    id: number;
    name: string;
  }

  interface Status {
    id: number;
    name: string;
    color: string;
  }

  interface RecordData {
    id: number;
    status_id: number;
    pipeline_id: number;
    responsible_user_id: number;
    name: string;
    price: number;
    created_by: number;
    created_at: number;
    contact_id: number;
    company_id: number;
    contact: Contact;
    user: User;
    status: Status;
  }

  export default defineComponent({
    components: { 
      UserOutlined, PhoneOutlined, MailOutlined
    },
    
    data() {
      return {
        dataSource: [] as RecordData[],
        
        columns: [
          {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
          },
          {
            title: 'Бюджет',
            dataIndex: 'price',
            key: 'price',
          },
          {
            title: 'Статус',
            dataIndex: ['status', 'name'],
            key: 'status',
            customRender: (record: any) => {
              return h('span', {
                class: 'ant-tag',
                style: { 
                  backgroundColor: record.record.status.color,
                  color: "#666666"
                 }
              }, record.value);
            },
          },
          {
            title: 'Ответственный',
            dataIndex: ['user', 'name'],
            key: 'user',
            customRender: (record: any) => {
              return h('div', [
                h(Avatar,
                  {
                    size: 'small',
                    style: { backgroundColor: '#1890ff' }
                  },
                  {
                    icon: () => h(UserOutlined)
                  }),
                h('span', { class:"contact-name", style: { verticalAlign: 'middle' } }, record.value),
              ]);
            },
          },
          {
            title: 'Дата создания',
            dataIndex: 'created_at',
            key: 'date',
            customRender: this.renderDate,
          },
        ] as ColumnsType<RecordData>,
        
        expandedRowKeys: [],
        
        loading: false,
      };
    },
    
    created() {
      this.fetchData();
    },
    
    methods: {
      fetchData() {
        this.loading = true;
        fetch(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_SERVER_PORT}/api/leads`)
          .then(response => response.json())
          .then(data => {
            this.dataSource = data;
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.error('Error fetching data:', error);
          });
      },
      
      handleExpand(expanded: boolean, record: any) {
        record.expanded = expanded;
      },
      
      renderDate(record: any) {
          if (!record?.value) return '';
          return new Date(record.value * 1000).toLocaleString('en-GB',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}).replace(',', ' ').replace(/\//g, '.');
      },
      
      async onSearch(value: string) {
        if (value) {
          this.loading = true;
          try {
            const response = await axios.get(`http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_SERVER_PORT}/api/leads`, {
              params: { query: value },
            });
            this.dataSource = response.data;
            this.loading = false;
          } catch (error) {
            this.loading = false;
            console.error('Error fetching data:', error);
          }
        } else {
          this.fetchData();
        }
      }
    },
  });
</script>

<style>
  .contact-box {
      display: flex;
      align-items: center;
      margin-left: 24px;
  }

  .contact-name {
    margin-left: 8px;
  }

  .ant-tag {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.88);
    font-size: 12px;
    line-height: 20px;
    list-style: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    display: inline-block;
    height: auto;
    margin-inline-end: 8px;
    padding-inline: 7px;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.02);
    border: 1px;
    border-radius: 4px;
    opacity: 1;
    transition: all 0.2s;
    text-align: start;
  }

  .contact-list {
      display: flex;
      margin-top: 0;
      margin-bottom: 0em !important;
  }

  ul {
      display: block;
      list-style-type: none;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 40px;
      unicode-bidi: isolate;
  }

  .ant-layout {
      display: flex;
      flex: auto;
      flex-direction: column;
      color: rgba(0, 0, 0, 0.88);
      min-height: 0;
      background: #f0f2f5;
  }
</style>