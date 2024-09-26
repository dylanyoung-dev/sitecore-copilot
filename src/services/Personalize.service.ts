import { ClientData } from '@/context/ClientContext';
import { ProductOptions } from '@/model/ProductOptions';
import {
  Client,
  FlowChannel,
  FlowScheduleType,
  FlowStatus,
  FlowType,
  IClientInitOptions,
  IFlowDefinition,
  RegionOptions,
} from 'sitecore-personalize-tenant-sdk';

export const createPersonalizationExperience = async (
  args: any,
  clients: ClientData[]
) => {
  let personalizeClient;
  if (args !== undefined && clients !== undefined) {
    const clientDetails = clients.find(
      (client) => (client.product = ProductOptions.PersonalizeCDP)
    );

    if (!clientDetails) {
      return {
        status: 'error',
        message:
          'You must have a client configured for Personalize/CDP to create an experience.',
      };
    }

    personalizeClient = new Client({
      clientId: clientDetails.clientId,
      clientSecret: clientDetails.clientSecret,
      region: mapRegion(clientDetails.region),
    } as IClientInitOptions);
    const flowTypeMapping = mapFlowType(args.type);

    console.log(args);

    if (!flowTypeMapping) {
      console.log(flowTypeMapping);
      return {
        status: 'error',
        message: `Invalid flow type: ${args.type} it should match one of the following: Web, API, Triggered`,
      };
    }

    const experience: IFlowDefinition = {
      name: args.name,
      friendlyId: args.name.toLowerCase().replace(/\s+/g, '_'),
      type: flowTypeMapping,
      channels: args.channels.map(
        (channel: string) => FlowChannel[channel as keyof typeof FlowChannel]
      ),
      status: FlowStatus.Draft,
      schedule: {
        type: FlowScheduleType.Simple,
        startDate: new Date().toISOString(),
      },
    };

    try {
      console.log('Creating personalization experience:', experience);
      let response = await personalizeClient.Flows.CreateExperience(experience);

      return {
        status: 'success',
        message: 'Personalization experience created successfully.',
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Failed to create personalization experience: ${error.message}`,
      };
    }
  }

  let response = await console.log(
    'Creating personalization experience:',
    args.params
  );
  return {
    status: 'fail',
    message:
      'Parameters are missing for creating a personalization experience.',
  };
};

export const getFlows = async (args: any, clients: ClientData[]) => {
  let personalizeClient;
  if (args !== undefined && clients !== undefined) {
    const clientDetails = clients.find(
      (client) => (client.product = ProductOptions.PersonalizeCDP)
    );

    if (!clientDetails) {
      return {
        status: 'error',
        message:
          'You must have a client configured for Personalize/CDP to create an experience.',
      };
    }

    personalizeClient = new Client({
      clientId: clientDetails.clientId,
      clientSecret: clientDetails.clientSecret,
      region: RegionOptions.EU,
    } as IClientInitOptions);

    console.log(args);

    try {
      let response = await personalizeClient.Flows.GetByRef(args.ref);

      console.log('Getting Flow Definition:', response);

      return {
        status: 'success',
        message: 'Found your experience or experiment successfully.',
        data: response,
      };
    } catch (error: any) {
      return {
        status: 'error',
        message: `Failed to create personalization experience: ${error.message}`,
      };
    }
  }
};

export const listPersonalizationExperiences = async (
  args: any,
  clients: ClientData[]
) => {
  let personalizeClient;
  if (args !== undefined && clients !== undefined) {
    const clientDetails = clients.find(
      (client: ClientData) => client.product === ProductOptions.PersonalizeCDP
    );

    if (!clientDetails) {
      return {
        status: 'error',
        message:
          'You must have a client configured for Personalize/CDP to create an experience.',
      };
    }

    personalizeClient = new Client({
      clientId: clientDetails.clientId,
      clientSecret: clientDetails.clientSecret,
      region: mapRegion(clientDetails.region),
    } as IClientInitOptions);

    console.log(args);

    try {
      const response = await personalizeClient.Flows.GetAll(2, 0);

      console.log('Getting All Flows:', response);

      const result = {
        status: 'success',
        message: 'Found your experiences successfully.',
        data: response,
      };

      console.log(result);

      return result;
    } catch (error: any) {
      console.error('Error retrieving personalization experiences:', error);
      return {
        status: 'error',
        message: `Failed to retrieve personalization experiences: ${error.message}`,
      };
    }
  }

  return {
    status: 'error',
    message: 'Invalid arguments or clients.',
  };
};

const mapFlowType = (type: string): FlowType | undefined => {
  let response: FlowType | undefined;
  switch (type) {
    case 'Web':
      response = FlowType.WebFlow;
      break;
    case 'API':
      response = FlowType.ApiFlow;
      break;
    case 'Triggered':
      response = FlowType.Triggered;
      break;
    default:
      response = undefined;
  }

  return response;
};

const mapRegion = (regionKey: string | undefined): RegionOptions => {
  if (!regionKey) {
    switch (regionKey?.toUpperCase()) {
      case 'EU':
        return RegionOptions.EU;
      case 'US':
        return RegionOptions.US;
      case 'AP':
        return RegionOptions.APJ;
    }
  }

  return RegionOptions.EU;
};
