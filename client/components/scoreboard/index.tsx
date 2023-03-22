import Link from 'next/link'
import { useQuery } from 'react-query'
import { Box, LinkBox, Center } from '@chakra-ui/layout'
import { Favourite } from '../favourite'
import { SkeletonLoading } from '../skeleton'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { getMatches } from '../../lib/api-helpers'
import { hypenateMatchString } from '../../lib/string'
import { ErrorState } from '../error'
import { Status } from '../status'
import { ScoreBoardTeams } from './scoreboard-teams'
import { Loading } from '../loading'
import { tabs } from './data'
import { useSession } from 'next-auth/react'

export function ScoreBoard() {
  const { data: session } = useSession()

  const { data, isLoading, error, isFetching } = useQuery<Match[], Error>({
    queryKey: ['fixtures'],
    queryFn: () => getMatches(),
    refetchInterval: 30000,
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
            <Tab
              key={tab.title}
              _selected={{ color: 'white', bg: '#029143' }}
              fontSize="0.9rem"
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box>
              <SkeletonLoading
                loading={isLoading}
                ammount={12}
                startColor="gray.800"
                endColor="gray.400"
                height="70px"
                borderRadius="5px"
              />
              <Center>
                <Loading loading={isFetching} />
              </Center>

              {error && <ErrorState />}

              {data &&
                data.map(({ teams, score, leagues, fixture, goals }: any) => (
                  <Link
                    href={{
                      pathname: '/matches/[match]',
                      query: {
                        id: fixture.id,
                      },
                    }}
                    passHref
                    as={`/matches/${hypenateMatchString(
                      teams.home.name,
                      teams.away.name
                    )}`}
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
                        fontWeight="500"
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

                          {/* {fixture.status ? (
                            <Status
                              status={fixture.status}
                              utcDate={fixture.date}
                            />
                          ) : null} */}

                          {teams ? <ScoreBoardTeams teams={teams} /> : null}

                          <Box
                            display="flex"
                            flexDirection="column"
                            minWidth="0"
                            marginLeft="auto"
                          >
                            <Box display="flex" marginBottom="5px">
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
