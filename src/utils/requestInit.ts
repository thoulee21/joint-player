import UserAgent from 'user-agents';

const randomUserAgent = new UserAgent({ deviceCategory: 'mobile' });

export const requestInit = {
    headers: {
        'User-Agent': randomUserAgent.toString(),
        'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    },
};
