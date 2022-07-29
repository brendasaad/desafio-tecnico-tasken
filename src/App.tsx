import { ApolloClient, InMemoryCache, gql, useQuery } from "@apollo/client";
import {
  Text,
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { BallTriangle } from "react-loader-spinner";

// Inicializa um cliente GraphQL
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://countries.trevorblades.com",
});

// responsável por dizer qual query deseja realizar na API
const LIST_COUNTRIES = gql`
  query ListCountriesInfos {
    countries {
      code
      name
      capital
      emoji
      currency
      languages {
        code
        name
      }
    }
  }
`;

interface ICountries {
  code: string;
  name: string;
  capital?: string;
  emoji: string;
  currency?: string;
  languages?: {
    code: string;
    name: string;
  }[];
}

// criação do componente que renderiza as informações desejadas nas querys
function CountryList() {
  const [countries, setCountries] = useState<ICountries[]>([]);
  const { data, loading, error } = useQuery(LIST_COUNTRIES, { client });

  const filterCountries = useCallback(() => {
    const fixedTypes: ICountries[] = data?.countries?.map(
      (item: ICountries) => item
    );

    const sortCountries = fixedTypes.sort((a, b) =>
      a?.name?.localeCompare(b?.name)
    );

    setCountries(sortCountries);
  }, [data?.countries]);

  useEffect(() => {
    if (data) filterCountries();
  }, [data, filterCountries]);

  const handleSortCountries = () => {
    const holdCountries: ICountries[] = [...countries].reverse();

    setCountries(holdCountries);
  };

  if (loading || error) {
    return (
      <>
        {loading ? (
          <BallTriangle color="#acafb3" height={80} width={80} />
        ) : (
          <Text fontSize="21px" paddingTop="20px" textAlign="center">
            {error?.message}
          </Text>
        )}
      </>
    );
  }

  return (
    <Box p={10} borderTopRadius="6px" border="1px solid #e2e8f0">
      <TableContainer borderTopRadius="6px" border="1px solid #e2e8f0">
        <Table border="1px solid #e2e8f0" borderTopRadius="6px">
          <TableCaption>
            Desafio Técnico Tasken - Estágio em Front-End / ReactJS
          </TableCaption>
          <Thead background="#c5c5c5">
            <Tr>
              <Th
                borderRight="1px solid #e2e8f0"
                cursor="pointer"
                onClick={handleSortCountries}
              >
                Países
              </Th>
              <Th borderRight="1px solid #e2e8f0">Capitais</Th>
              <Th borderRight="1px solid #e2e8f0">Bandeiras</Th>
              <Th borderRight="1px solid #e2e8f0">Moeda</Th>
              <Th borderRight="1px solid #e2e8f0">Língua falada</Th>
            </Tr>
          </Thead>
          {countries?.map((country: ICountries) => (
            <Tbody key={country.code}>
              <Tr>
                <Td borderRight="1px solid #e2e8f0">{country.name}</Td>
                <Td borderRight="1px solid #e2e8f0">{country.capital}</Td>
                <Td borderRight="1px solid #e2e8f0">{country.emoji}</Td>
                <Td borderRight="1px solid #e2e8f0">
                  {country.currency?.replace(",", ", ")}
                </Td>
                <Td borderRight="1px solid #e2e8f0">
                  {country.languages?.map((lang, index) =>
                    country.languages?.length === 1
                      ? lang.name
                      : `${lang.name}${
                          country.languages &&
                          index !== country.languages?.length - 1
                            ? ", "
                            : ""
                        }`
                  )}
                </Td>
              </Tr>
            </Tbody>
          ))}
        </Table>
      </TableContainer>
    </Box>
  );
}

export default CountryList;
