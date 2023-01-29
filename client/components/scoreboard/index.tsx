import Link from 'next/link'
import { Box, LinkBox, Center } from '@chakra-ui/layout'
import { Favourite } from '../favourite'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
} from '@chakra-ui/react'
import { useQuery } from 'react-query'
import { getMatches } from '../../lib/api-helpers'
import { hypenateMatchString } from '../../lib/string'
import { ErrorState } from '../error'
import { ScoreBoardStatus } from './scoreboard-status'
import { ScoreBoardTeams } from './scoreboard-teams'
import { tabs } from '../../data/scoreboard'
import { useSession } from 'next-auth/react'

export function ScoreBoard() {
  const { data: session }: any = useSession()

  const { data, error, isLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
    // refetchInterval: 30000,
  })

  return (
    <Box
      borderRadius="15px"
      background={{ md: '#121212' }}
      minHeight="60vh"
      margin="0 auto"
    >
      <Tabs isFitted variant="enclosed" colorScheme="red">
        <TabList>
          {tabs.map((tab) => (
            <Tab key={tab.title} _selected={{ color: 'white', bg: '#029143' }}>
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              {isLoading && (
                <Center>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="#029143"
                    size="lg"
                  />
                </Center>
              )}

              {error && <ErrorState />}

              {data?.map(({ teams, score, leagues, fixture, goals }: any) => (
                <Link
                  href={hypenateMatchString(
                    '/football/',
                    fixture.id,
                    teams.home.name,
                    teams.away.name
                  )}
                  passHref
                  key={teams.home.name}
                >
                  <Box
                    key={teams.home.name}
                    margin={{ base: '0px' }}
                    marginBottom={{ base: '1rem', md: '0' }}
                    fontSize="1.25rem"
                    fontWeight="600"
                    color="white"
                    borderRadius="5px"
                    sx={{
                      '&:hover': {
                        background: '#313131',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <LinkBox
                      display="flex"
                      padding={{ base: '0.5rem 1rem' }}
                      marginBottom="1rem"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        flex=" 1 1 0%"
                        fontSize={{ base: '14px', md: 'auto' }}
                      >
                        <Favourite
                          fixture={fixture}
                          userId={session?.user.id}
                        />

                        {fixture.status ? (
                          <ScoreBoardStatus
                            status={fixture.status}
                            utcDate={fixture.date}
                          />
                        ) : null}

                        {teams ? <ScoreBoardTeams teams={teams} /> : null}

                        <Box
                          display="flex"
                          flexDirection="column"
                          minWidth="0"
                          marginLeft="auto"
                        >
                          <Box display="flex" marginBottom="10px">
                            {goals.home}
                          </Box>
                          <Box display="flex">{goals.away}</Box>
                        </Box>
                      </Box>
                    </LinkBox>
                  </Box>
                </Link>
              ))}
            </Box>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
          <TabPanel>
            <p>four!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}