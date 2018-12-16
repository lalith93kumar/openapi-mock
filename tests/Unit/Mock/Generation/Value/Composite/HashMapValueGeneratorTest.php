<?php
/*
 * This file is part of Swagger Mock.
 *
 * (c) Igor Lazarev <strider2038@yandex.ru>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace App\Tests\Unit\Mock\Generation\Value\Composite;

use App\Mock\Generation\Value\Composite\HashMapValueGenerator;
use App\Mock\Parameters\Schema\Type\Composite\HashMapType;
use App\Tests\Utility\Dummy\DummyType;
use App\Tests\Utility\TestCase\FakerCaseTrait;
use App\Tests\Utility\TestCase\ValueGeneratorCaseTrait;
use Faker\Factory;
use PHPUnit\Framework\TestCase;

class HashMapValueGeneratorTest extends TestCase
{
    use FakerCaseTrait;
    use ValueGeneratorCaseTrait;

    private const DEFAULT_MIN_PROPERTIES = 1;
    private const DEFAULT_MAX_PROPERTIES = 20;
    private const PROPERTIES_COUNT = 5;

    protected function setUp(): void
    {
        $this->setUpFaker();
        $this->setUpValueGenerator();
    }

    /** @test */
    public function generateValue_hashMap_hashMapOfTypedItemsGeneratedAndReturned(): void
    {
        $type = new HashMapType();
        $type->value = new DummyType();
        $generator = new HashMapValueGenerator($this->faker, $this->valueGeneratorLocator);
        $this->givenValueGeneratorLocator_getValueGenerator_returnsValueGenerator();
        $hashMapValue = $this->givenValueGenerator_generateValue_returnsValue();
        $faker = $this->givenFaker_method_returnsNewFaker('unique');
        $this->givenFakerMock_method_returnsValue($faker, 'word', 'key');

        $hashMap = $generator->generateValue($type);

        $this->assertValueGeneratorLocator_getValueGenerator_isCalledOnceWithType($type->value);
        $this->assertValueGenerator_generateValue_isCalledAtLeastOnceWithType($type->value);
        $this->assertGreaterThanOrEqual(self::DEFAULT_MIN_PROPERTIES, \count($hashMap));
        $this->assertLessThanOrEqual(self::DEFAULT_MAX_PROPERTIES, \count($hashMap));
        $this->assertFaker_method_wasCalledAtLeastOnce('unique');
        $this->assertFakerMock_method_wasCalledAtLeastOnce($faker, 'word');
        $this->assertArraySubset(['key' => $hashMapValue], $hashMap);
    }

    /** @test */
    public function generateValue_hashMapWithFixedCountOfProperties_hashMapWithPropertiesCountReturned(): void
    {
        $type = new HashMapType();
        $type->value = new DummyType();
        $type->minProperties = self::PROPERTIES_COUNT;
        $type->maxProperties = self::PROPERTIES_COUNT;
        $generator = new HashMapValueGenerator(Factory::create(), $this->valueGeneratorLocator);
        $this->givenValueGeneratorLocator_getValueGenerator_returnsValueGenerator();
        $this->givenValueGenerator_generateValue_returnsValue();

        $hashMap = $generator->generateValue($type);

        $this->assertValueGeneratorLocator_getValueGenerator_isCalledOnceWithType($type->value);
        $this->assertValueGenerator_generateValue_isCalledAtLeastOnceWithType($type->value);
        $this->assertCount(self::PROPERTIES_COUNT, $hashMap);
    }
}