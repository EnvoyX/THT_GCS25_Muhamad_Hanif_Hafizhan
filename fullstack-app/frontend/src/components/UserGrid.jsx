/* eslint-disable react/prop-types */
import { Flex, Grid, Spinner, Text } from '@chakra-ui/react';

import UserCard from './UserCard';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../App';

// Component User Grid

const UserGrid = ({ users, setUsers }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await fetch(BASE_URL + '/friends');
        const data = await res.json();

        // Jika tidak berhasil
        if (!res.ok) {
          throw new Error(data.error);
        }
        // Jika Berhasil
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, [setUsers]);

  console.log(users);
  return (
    <>
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {/* Render UserCard untuk setiap data kontak yang ada */}
        {users.map((user) => (
          <UserCard key={user.id} user={user} setUsers={setUsers} />
        ))}
      </Grid>

      {/* Jika masi fetching */}
      {isLoading && (
        <Flex justifyContent={'center'}>
          <Spinner size={'xl'} />
        </Flex>
      )}
      {/* Jika sudah selesai fethcing, dan tidak ada data kontak */}
      {!isLoading && users.length === 0 && (
        <Flex justifyContent={'center'}>
          <Text fontSize={'xl'}>
            <Text as={'span'} fontSize={'2xl'} fontWeight={'bold'} mr={2}>
              Poor you! 🥺
            </Text>
            No friends found.
          </Text>
        </Flex>
      )}
    </>
  );
};
export default UserGrid;
