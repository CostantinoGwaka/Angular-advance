import {gql} from 'apollo-angular';

export const GET_USER_TASK_SUMMARY = gql`
  query getMyTasksSummary{
    getMyTasksSummary{
      idadi
      model
    }
  }
`;

export const GET_WORKFLOW_TASK_SUMMARY = gql`
  query getMyClarificationTasksSummary{
    getMyClarificationTasksSummary{
      idadi
      model
    }
  }
`;
