import {
  MantineProvider,
  AppShell,
  Navbar,
  Header,
  Group,
  Flex,
  Title,
} from '@mantine/core';
import { Display, Export, Toolbar } from 'components';
import { AnnotationProvider } from 'contexts';

function App() {
  return (
    <AnnotationProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme: 'dark' }}>
        <AppShell
          padding='md'
          style={{ overflow: 'hidden' }}
          navbar={
            <Navbar width={{ base: 300 }}>
              <Toolbar />
            </Navbar>
          }
          header={
            <Header height={100} px={30}>
              <Flex
                style={{ height: '100%' }}
                align='center'
                justify='space-between'>
                <Title order={1}>Beyond Annotations</Title>
                <Export />
              </Flex>
            </Header>
          }>
          <Display style={{ width: '100%', height: '100%' }} />
        </AppShell>
      </MantineProvider>
    </AnnotationProvider>
  );
}

export default App;
