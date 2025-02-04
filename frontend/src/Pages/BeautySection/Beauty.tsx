import { Box, Flex, Grid, Image, Text, VStack } from "@chakra-ui/react";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { EmptyFilterResults, Filter } from "../../utils/FIlter&Sort";
import { useEffect, useState } from "react";
import { BeautyType, FilterObjects } from "../../utils/Types";
import data from "../../assets/BeautyAssets/beauty.json";
import Pagination from "../../components/Pagination";
import { BeautyProduct } from "./Products";
import { FaRegStar } from "react-icons/fa6";

const Beauty = () => {
  const [filters, setFilters] = useState<FilterObjects[]>([]);
  const [productsPerPage] = useState(12);
  const [products, setProducts] = useState(data);

  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });
  const [currentPage, setCurrentPage] = useState<string>(
    searchParams.get("page") || "1"
  );

  const params = useParams();

  // const context = useContext(AuthContext);

  // Get current page
  const indexOfLastProduct = parseInt(currentPage) * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const brand = searchParams.get("brand")?.split(",") || [];
  if (brand.indexOf("") >= 0) {
    brand.splice(brand.indexOf(""), 1);
  }
  const product_type = searchParams.get("product_type")?.split(",") || [];
  if (product_type.indexOf("") >= 0) {
    product_type.splice(product_type.indexOf(""), 1);
  }

  useEffect(() => {
    setFilters([
      {
        label: "Brand",
        data: data
          .map((data) => data.brand)
          .filter((data, i, ar) => ar.indexOf(data) === i)
          .sort(),
      },
      {
        label: "Product Type",
        data: data
          .map((data) => data.product_type)
          .filter((data, i, ar) => ar.indexOf(data) === i)
          .sort(),
      },
    ]);
    filteringData();
    if (params.product) {
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterChange = (data: string, label: string) => {
    let indexOfArr: number;
    if (searchParams.get("page"))
      setSearchParams(
        (prev) => {
          prev.set("page", "1");
          return prev;
        },
        { replace: true }
      );
    if (label === "Brand") {
      // Check if data already exists in searchParams.brand array
      indexOfArr = brand.indexOf(data);
      if (indexOfArr >= 0) {
        brand.splice(indexOfArr, 1);
      } else {
        brand.push(data);
      }
      setSearchParams(
        (prev) => {
          prev.set("brand", `${brand.join(",")}`);
          return prev;
        },
        { replace: true }
      );
    } else if (label === "Product Type") {
      // Check if data already exists in searchParams.product_type array
      indexOfArr = product_type.indexOf(data);
      if (indexOfArr >= 0) {
        product_type.splice(indexOfArr, 1);
      } else {
        product_type.push(data);
      }
      setSearchParams(
        (prev) => {
          prev.set("product_type", `${product_type.join(",")}`);
          return prev;
        },
        { replace: true }
      );
    }
    filteringData();
  };

  const filteringData = () => {
    if (brand.length > 0 && product_type.length > 0) {
      const brandFilter = data
        .filter((product) => brand.indexOf(product.brand) >= 0)
        .filter((product) => product_type.indexOf(product.product_type) >= 0);
      setProducts(brandFilter);
      return;
    }
    if (brand.length > 0 && product_type.length === 0) {
      const brandFilter = data.filter(
        (product) => brand.indexOf(product.brand) >= 0
      );
      setProducts(brandFilter);
      return;
    }
    if (product_type.length > 0 && brand.length === 0) {
      const productTypeFilter = data.filter(
        (product) => product_type.indexOf(product.product_type) >= 0
      );
      setProducts(productTypeFilter);
      return;
    }
    setSearchParams({ category: "Beauty", page: "1" }, { replace: true });
    setCurrentPage("1");
    setProducts(data);
    return;
  };

  const resetFilters = () => {
    setSearchParams({ category: "Beauty", page: "1" }, { replace: true });
    setProducts(data);
  };

  if (params.product) {
    const selectProduct: BeautyType[] = data.filter(
      (product) => product.name === params.product
    );
    return <BeautyProduct product={selectProduct} />;
  }

  return (
    <Flex my={10} gap={7}>
      <Filter
        props={filters}
        handleFilterChange={(data, label) => filterChange(data, label)}
        checkedBox={brand.concat(product_type)}
        reset={resetFilters}
      ></Filter>
      {products.length === 0 && <EmptyFilterResults />}
      {data && (
        <Flex direction={"column"}>
          <Grid templateColumns="repeat(4, 1fr)" gap={1}>
            {currentProducts.map((item, key) => (
              <Box
                key={key}
                borderWidth="1px"
                borderRadius="5px"
                backgroundColor={"#EBEBEB"}
                padding={2}
                border={"1px solid black"}
                _hover={{
                  transform: "scale(1.05)",
                  transition: "transform .1s ease-in-out",
                }}
              >
                <NavLink to={`./beauty/${item.name}`}>
                  <Image
                    width={"100%"}
                    h={"7rem"}
                    src={item.api_featured_image}
                    alt={item.name}
                  />
                  <VStack align={"stretch"} mt={2}>
                    <Text fontWeight={700} fontSize={".8rem"}>
                      {item.name}
                    </Text>
                    <Text fontWeight={700} fontSize={".7rem"}>
                      {item.brand}
                    </Text>
                    <Text fontSize={".7rem"} fontWeight={700}>
                      {item.product_type} | {item.category}
                    </Text>
                    <Text fontSize={"1rem"} fontWeight={700}>
                      $
                      {item.price.toString().indexOf(".") > 0
                        ? item.price
                        : `${item.price}.0`}
                    </Text>
                    <Flex
                      fontWeight={700}
                      fontSize={".7rem"}
                      alignItems={"center"}
                      gap={".5rem"}
                    >
                      <FaRegStar size={15} />
                      {item.rating ? item.rating : "Unrated"}
                    </Flex>
                  </VStack>
                </NavLink>
              </Box>
            ))}
          </Grid>
          <Pagination
            productsPerPage={productsPerPage}
            totalProducts={products.length}
            currentPage={parseInt(searchParams.get("page") || "1")}
            paginate={(number) => {
              setCurrentPage(`${number}`);
            }}
          />
        </Flex>
      )}
    </Flex>
  );
};

export default Beauty;
