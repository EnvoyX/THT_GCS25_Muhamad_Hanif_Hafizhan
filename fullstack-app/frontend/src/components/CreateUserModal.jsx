/* eslint-disable react/prop-types */
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BiAddToQueue } from 'react-icons/bi';
import { BASE_URL } from '../App';

// Component Create User Modal

const CreateUserModal = ({ setUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  // Input untuk request API
  const [inputs, setInputs] = useState({
    name: '',
    role: '',
    description: '',
    gender: '',
  });
  const toast = useToast();

  // Function untuk menghandle untuk menambah kontak baru
  // Dengan melakukan fetch request dengan method POST
  const handleCreateUser = async (e) => {
    e.preventDefault(); // menghindari refresh page
    setIsLoading(true);
    try {
      const res = await fetch(BASE_URL + '/friends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });

      // Data kontak baru
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      toast({
        status: 'success',
        title: 'Success!',
        description: 'Contact created successfully.',
        duration: 2000,
        position: 'top-center',
      });
      onClose();
      // Semua list kontak yang sudah ada, akan ditambah dengan kontak baru (data)
      setUsers((prevUsers) => [...prevUsers, data]);

      // Clear inputs
      setInputs({
        name: '',
        role: '',
        description: '',
        gender: '',
      });
    } catch (error) {
      toast({
        status: 'error',
        title: 'An error occurred.',
        description: error.message,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={onOpen}>
        <BiAddToQueue size={20} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleCreateUser}>
          <ModalContent>
            <ModalHeader> New Contact </ModalHeader>
            <ModalCloseButton />

            <ModalBody pb={6}>
              <Flex alignItems={'center'} gap={4}>
                {/* Left */}
                {/* Input Nama */}
                <FormControl>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    placeholder="John Doe"
                    value={inputs.name}
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                  />
                </FormControl>

                {/* input Role */}
                {/* Right */}
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Input
                    placeholder="Software Engineer"
                    value={inputs.role}
                    onChange={(e) =>
                      setInputs({ ...inputs, role: e.target.value })
                    }
                  />
                </FormControl>
              </Flex>

              {/* Input Description */}
              <FormControl mt={4}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  resize={'none'}
                  overflowY={'hidden'}
                  placeholder="He's a software engineer who loves to code and build things."
                  value={inputs.description}
                  onChange={(e) =>
                    setInputs({ ...inputs, description: e.target.value })
                  }
                />
              </FormControl>

              {/* Input Gender */}
              <RadioGroup mt={4}>
                <Flex gap={5}>
                  <Radio
                    value="male"
                    onChange={(e) =>
                      setInputs({ ...inputs, gender: e.target.value })
                    }
                  >
                    Male
                  </Radio>
                  <Radio
                    value="female"
                    onChange={(e) =>
                      setInputs({ ...inputs, gender: e.target.value })
                    }
                  >
                    Female
                  </Radio>
                </Flex>
              </RadioGroup>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isLoading}
              >
                Add
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};
export default CreateUserModal;
