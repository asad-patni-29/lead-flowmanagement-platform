const LeadEndpoints = {
  list: '/leads',
  create: '/leads',
  detail: (id: string) => `/leads/${id}`,
  notes: (id: string) => `/leads/${id}/notes`,
  publicCreate: '/public/leads',
};

export default LeadEndpoints;
