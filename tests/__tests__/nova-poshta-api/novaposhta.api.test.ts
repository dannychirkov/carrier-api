import { spec } from 'pactum';
import { getApiKey, shouldSkipIntegrationTests } from '../../setup/pactum.setup';

describe('Nova Poshta API Integration Tests', () => {
  const describeOrSkip = shouldSkipIntegrationTests() ? describe.skip : describe;

  describeOrSkip('Address API', () => {
    it('should search settlements', async () => {
      await spec()
        .post('/')
        .withJson({
          apiKey: getApiKey(),
          modelName: 'Address',
          calledMethod: 'searchSettlements',
          methodProperties: {
            CityName: 'Київ',
            Limit: '5',
          },
        })
        .expectStatus(200)
        .expectJsonMatch({
          success: true,
        })
        .toss();
    });
  });
});
